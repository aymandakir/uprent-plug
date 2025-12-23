import { supabaseAdmin } from "@rentfusion/database";
import { notificationService } from "./index";
import type { Property } from "@rentfusion/database";

export class PropertyMatcher {
  /**
   * Find users whose search profiles match this property and send alerts.
   */
  async matchProperty(property: Property): Promise<void> {
    console.log(`[Matcher] Checking matches for property ${property.id}`);

    const { data: profiles, error } = await supabaseAdmin
      .from("search_profiles")
      .select("*, users!inner(id, email, subscription_tier, metadata)")
      .eq("active", true)
      .eq("notifications_enabled", true);

    if (error || !profiles) {
      console.error("Failed to fetch search profiles:", error);
      return;
    }

    for (const profile of profiles) {
      const matchScore = this.calculateMatchScore(property, profile);

      if (matchScore > 50) {
        console.log(`[Matcher] Match found! User ${profile.user_id}, score: ${matchScore}`);

        const { data: match, error: matchError } = await supabaseAdmin
          .from("property_matches")
          .insert({
            property_id: property.id,
            search_profile_id: profile.id,
            user_id: profile.user_id,
            match_score: matchScore
          })
          .select("id")
          .single();

        if (matchError) {
          console.error("Failed to insert match:", matchError);
        }

        await notificationService.sendPropertyAlert({
          userId: profile.user_id,
          propertyId: property.id as string,
          property,
          matchScore,
          channels: (profile.notification_channels as string[]) || ["email"]
        });
      }
    }
  }

  private calculateMatchScore(property: Property, profile: any): number {
    let score = 0;

    if (!profile.cities?.includes(property.city)) {
      return 0;
    }
    score += 30;

    if (property.price >= profile.budget_min && property.price <= profile.budget_max) {
      score += 25;
    } else if (property.price > profile.budget_max) {
      return 0;
    }

    if (profile.bedrooms_min && property.bedrooms) {
      if (property.bedrooms >= profile.bedrooms_min) {
        score += 15;
      }
    }

    if (profile.furnished !== null && profile.furnished !== undefined) {
      if (property.furnished === profile.furnished) {
        score += 10;
      }
    }

    if (profile.pets_allowed && property.pets_allowed) {
      score += 10;
    }

    if (profile.keywords?.length) {
      const text = `${property.title ?? ""} ${property.description ?? ""}`.toLowerCase();
      const matchedKeywords = profile.keywords.filter((kw: string) => text.includes(kw.toLowerCase()));
      score += Math.min(matchedKeywords.length * 5, 10);
    }

    return Math.min(score, 100);
  }
}

export const propertyMatcher = new PropertyMatcher();

