
import { supabase } from '@/integrations/supabase/client';

// Temporary type definitions until Supabase types are regenerated
interface CardshowBrandRow {
  id: string;
  dna_code: string;
  file_name: string;
  display_name: string;
  product_name?: string;
  image_url: string;
  thumbnail_url?: string;
  file_size?: number;
  image_dimensions?: any;
  category: string;
  group_type?: string;
  font_style: string;
  design_elements: string[];
  style_tags: string[];
  color_palette: string[];
  primary_color: string;
  secondary_color: string;
  tertiary_color?: string;
  quaternary_color?: string;
  logo_theme: any;
  theme_usage: any;
  team_code?: string;
  team_name?: string;
  team_city?: string;
  league?: string;
  mascot?: string;
  founded_year?: number;
  decade?: string;
  rarity: string;
  power_level: number;
  unlock_method: string;
  collectibility_score: number;
  is_blendable: boolean;
  is_remixable: boolean;
  total_supply?: number;
  current_supply: number;
  drop_rate: number;
  description?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  is_active: boolean;
  sort_order: number;
}

interface BrandUsageStatsRow {
  id: string;
  brand_id: string;
  user_id?: string;
  usage_count: number;
  last_used_at: string;
  usage_context?: string;
  created_at: string;
  updated_at: string;
}

export type { CardshowBrandRow as CardshowBrand, BrandUsageStatsRow as BrandUsageStats };

export type CreateBrandRequest = Omit<CardshowBrandRow, 'id' | 'created_at' | 'updated_at' | 'current_supply' | 'is_active' | 'sort_order'>;

export type BrandMintingRules = {
  id: string;
  brand_id: string;
  requires_achievement?: string;
  seasonal_only: boolean;
  requires_purchase: boolean;
  pack_exclusive: boolean;
  special_requirements: any;
  created_at: string;
};

export class CardshowBrandService {
  // Fetch all active brands
  static async getAllBrands(): Promise<CardshowBrandRow[]> {
    const { data, error } = await supabase
      .rpc('get_cardshow_brands')
      .then(async (result) => {
        // Fallback to direct query if RPC doesn't exist
        if (result.error) {
          return await supabase
            .from('cardshow_brands' as any)
            .select('*')
            .eq('is_active', true)
            .order('sort_order', { ascending: true });
        }
        return result;
      })
      .catch(async () => {
        // Final fallback with raw SQL if needed
        return await supabase.rpc('exec_sql', {
          query: 'SELECT * FROM cardshow_brands WHERE is_active = true ORDER BY sort_order ASC'
        }).then(result => ({ data: result.data, error: result.error }));
      });

    if (error) {
      console.error('Error fetching brands:', error);
      throw error;
    }

    return (data || []) as CardshowBrandRow[];
  }

  // Fetch brand by DNA code
  static async getBrandByDnaCode(dnaCode: string): Promise<CardshowBrandRow | null> {
    try {
      const { data, error } = await supabase.rpc('exec_sql', {
        query: 'SELECT * FROM cardshow_brands WHERE dna_code = $1 AND is_active = true LIMIT 1',
        params: [dnaCode]
      });

      if (error) {
        console.error('Error fetching brand by DNA code:', error);
        throw error;
      }

      return data && data.length > 0 ? data[0] as CardshowBrandRow : null;
    } catch (error) {
      console.error('Error in getBrandByDnaCode:', error);
      return null;
    }
  }

  // Search brands by category, team, or tags
  static async searchBrands(params: {
    category?: string;
    group_type?: string;
    team_code?: string;
    rarity?: string;
    search_term?: string;
  }): Promise<CardshowBrandRow[]> {
    try {
      let query = 'SELECT * FROM cardshow_brands WHERE is_active = true';
      const queryParams: any[] = [];
      let paramCount = 0;

      if (params.category) {
        paramCount++;
        query += ` AND category = $${paramCount}`;
        queryParams.push(params.category);
      }

      if (params.group_type) {
        paramCount++;
        query += ` AND group_type = $${paramCount}`;
        queryParams.push(params.group_type);
      }

      if (params.team_code) {
        paramCount++;
        query += ` AND team_code = $${paramCount}`;
        queryParams.push(params.team_code);
      }

      if (params.rarity) {
        paramCount++;
        query += ` AND rarity = $${paramCount}`;
        queryParams.push(params.rarity);
      }

      if (params.search_term) {
        paramCount++;
        query += ` AND (display_name ILIKE $${paramCount} OR team_name ILIKE $${paramCount} OR dna_code ILIKE $${paramCount})`;
        queryParams.push(`%${params.search_term}%`);
      }

      query += ' ORDER BY sort_order ASC';

      const { data, error } = await supabase.rpc('exec_sql', {
        query,
        params: queryParams
      });

      if (error) {
        console.error('Error searching brands:', error);
        throw error;
      }

      return (data || []) as CardshowBrandRow[];
    } catch (error) {
      console.error('Error in searchBrands:', error);
      return [];
    }
  }

  // Create a new brand (admin only)
  static async createBrand(brandData: CreateBrandRequest): Promise<CardshowBrandRow> {
    try {
      const insertData = {
        ...brandData,
        font_style: brandData.font_style || 'Unknown',
        design_elements: brandData.design_elements || [],
        style_tags: brandData.style_tags || [],
        power_level: brandData.power_level || 50,
        unlock_method: brandData.unlock_method || 'starter',
        collectibility_score: brandData.collectibility_score || 50,
        is_blendable: brandData.is_blendable !== undefined ? brandData.is_blendable : true,
        is_remixable: brandData.is_remixable !== undefined ? brandData.is_remixable : true,
        current_supply: 0,
        drop_rate: brandData.drop_rate || 0.5,
        is_active: true,
        sort_order: 0
      };

      const columns = Object.keys(insertData).join(', ');
      const values = Object.keys(insertData).map((_, i) => `$${i + 1}`).join(', ');
      const params = Object.values(insertData);

      const { data, error } = await supabase.rpc('exec_sql', {
        query: `INSERT INTO cardshow_brands (${columns}) VALUES (${values}) RETURNING *`,
        params
      });

      if (error) {
        console.error('Error creating brand:', error);
        throw error;
      }

      return data[0] as CardshowBrandRow;
    } catch (error) {
      console.error('Error in createBrand:', error);
      throw error;
    }
  }

  // Update brand usage statistics
  static async trackBrandUsage(brandId: string, userId: string, context: string): Promise<void> {
    try {
      const { error } = await supabase.rpc('exec_sql', {
        query: `
          INSERT INTO brand_usage_stats (brand_id, user_id, usage_context, usage_count, last_used_at)
          VALUES ($1, $2, $3, 1, NOW())
          ON CONFLICT (brand_id, user_id, usage_context)
          DO UPDATE SET usage_count = brand_usage_stats.usage_count + 1, last_used_at = NOW()
        `,
        params: [brandId, userId, context]
      });

      if (error) {
        console.error('Error tracking brand usage:', error);
        // Don't throw - usage tracking is non-critical
      }
    } catch (error) {
      console.error('Error in trackBrandUsage:', error);
      // Don't throw - usage tracking is non-critical
    }
  }

  // Get brand usage statistics
  static async getBrandUsageStats(brandId: string): Promise<BrandUsageStatsRow[]> {
    try {
      const { data, error } = await supabase.rpc('exec_sql', {
        query: 'SELECT * FROM brand_usage_stats WHERE brand_id = $1',
        params: [brandId]
      });

      if (error) {
        console.error('Error fetching brand usage stats:', error);
        throw error;
      }

      return (data || []) as BrandUsageStatsRow[];
    } catch (error) {
      console.error('Error in getBrandUsageStats:', error);
      return [];
    }
  }

  // Get brands by rarity for gaming mechanics
  static async getBrandsByRarity(rarity: string): Promise<CardshowBrandRow[]> {
    try {
      const { data, error } = await supabase.rpc('exec_sql', {
        query: 'SELECT * FROM cardshow_brands WHERE rarity = $1 AND is_active = true ORDER BY collectibility_score DESC',
        params: [rarity]
      });

      if (error) {
        console.error('Error fetching brands by rarity:', error);
        throw error;
      }

      return (data || []) as CardshowBrandRow[];
    } catch (error) {
      console.error('Error in getBrandsByRarity:', error);
      return [];
    }
  }

  // Get collectible brands (limited supply)
  static async getCollectibleBrands(): Promise<CardshowBrandRow[]> {
    try {
      const { data, error } = await supabase.rpc('exec_sql', {
        query: 'SELECT * FROM cardshow_brands WHERE total_supply IS NOT NULL AND is_active = true ORDER BY rarity DESC',
        params: []
      });

      if (error) {
        console.error('Error fetching collectible brands:', error);
        throw error;
      }

      return (data || []) as CardshowBrandRow[];
    } catch (error) {
      console.error('Error in getCollectibleBrands:', error);
      return [];
    }
  }
}
