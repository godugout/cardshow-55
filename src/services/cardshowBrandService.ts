
import { supabase } from '@/integrations/supabase/client';
import type { CardshowBrand, CreateBrandRequest, BrandMintingRules, BrandUsageStats } from '@/types/cardshowBrands';

export class CardshowBrandService {
  // Fetch all active brands
  static async getAllBrands(): Promise<CardshowBrand[]> {
    const { data, error } = await supabase
      .from('cardshow_brands')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching brands:', error);
      throw error;
    }

    return data || [];
  }

  // Fetch brand by DNA code
  static async getBrandByDnaCode(dnaCode: string): Promise<CardshowBrand | null> {
    const { data, error } = await supabase
      .from('cardshow_brands')
      .select('*')
      .eq('dna_code', dnaCode)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No rows found
      }
      console.error('Error fetching brand by DNA code:', error);
      throw error;
    }

    return data;
  }

  // Search brands by category, team, or tags
  static async searchBrands(params: {
    category?: string;
    group_type?: string;
    team_code?: string;
    rarity?: string;
    search_term?: string;
  }): Promise<CardshowBrand[]> {
    let query = supabase
      .from('cardshow_brands')
      .select('*')
      .eq('is_active', true);

    if (params.category) {
      query = query.eq('category', params.category);
    }

    if (params.group_type) {
      query = query.eq('group_type', params.group_type);
    }

    if (params.team_code) {
      query = query.eq('team_code', params.team_code);
    }

    if (params.rarity) {
      query = query.eq('rarity', params.rarity);
    }

    if (params.search_term) {
      query = query.or(`display_name.ilike.%${params.search_term}%,team_name.ilike.%${params.search_term}%,dna_code.ilike.%${params.search_term}%`);
    }

    const { data, error } = await query.order('sort_order', { ascending: true });

    if (error) {
      console.error('Error searching brands:', error);
      throw error;
    }

    return data || [];
  }

  // Create a new brand (admin only)
  static async createBrand(brandData: CreateBrandRequest): Promise<CardshowBrand> {
    const { data, error } = await supabase
      .from('cardshow_brands')
      .insert([{
        ...brandData,
        font_style: 'Unknown', // Default value
        design_elements: [],
        style_tags: [],
        power_level: 50,
        unlock_method: 'starter',
        collectibility_score: 50,
        is_blendable: true,
        is_remixable: true,
        current_supply: 0,
        drop_rate: 0.5,
        is_active: true,
        sort_order: 0
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating brand:', error);
      throw error;
    }

    return data;
  }

  // Update brand usage statistics
  static async trackBrandUsage(brandId: string, userId: string, context: string): Promise<void> {
    const { error } = await supabase
      .from('brand_usage_stats')
      .upsert({
        brand_id: brandId,
        user_id: userId,
        usage_context: context,
        usage_count: 1,
        last_used_at: new Date().toISOString()
      }, {
        onConflict: 'brand_id,user_id,usage_context',
        ignoreDuplicates: false
      });

    if (error) {
      console.error('Error tracking brand usage:', error);
      // Don't throw - usage tracking is non-critical
    }
  }

  // Get brand usage statistics
  static async getBrandUsageStats(brandId: string): Promise<BrandUsageStats[]> {
    const { data, error } = await supabase
      .from('brand_usage_stats')
      .select('*')
      .eq('brand_id', brandId);

    if (error) {
      console.error('Error fetching brand usage stats:', error);
      throw error;
    }

    return data || [];
  }

  // Get brands by rarity for gaming mechanics
  static async getBrandsByRarity(rarity: string): Promise<CardshowBrand[]> {
    const { data, error } = await supabase
      .from('cardshow_brands')
      .select('*')
      .eq('rarity', rarity)
      .eq('is_active', true)
      .order('collectibility_score', { ascending: false });

    if (error) {
      console.error('Error fetching brands by rarity:', error);
      throw error;
    }

    return data || [];
  }

  // Get collectible brands (limited supply)
  static async getCollectibleBrands(): Promise<CardshowBrand[]> {
    const { data, error } = await supabase
      .from('cardshow_brands')
      .select('*')
      .not('total_supply', 'is', null)
      .eq('is_active', true)
      .order('rarity', { ascending: false });

    if (error) {
      console.error('Error fetching collectible brands:', error);
      throw error;
    }

    return data || [];
  }
}
