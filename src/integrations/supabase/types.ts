export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_roles: {
        Row: {
          created_at: string | null
          id: string
          role: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      auction_bids: {
        Row: {
          amount: number
          auction_id: string | null
          bid_time: string | null
          bid_type: string | null
          bidder_id: string | null
          created_at: string | null
          id: string
          is_winning_bid: boolean | null
          proxy_max_amount: number | null
        }
        Insert: {
          amount: number
          auction_id?: string | null
          bid_time?: string | null
          bid_type?: string | null
          bidder_id?: string | null
          created_at?: string | null
          id?: string
          is_winning_bid?: boolean | null
          proxy_max_amount?: number | null
        }
        Update: {
          amount?: number
          auction_id?: string | null
          bid_time?: string | null
          bid_type?: string | null
          bidder_id?: string | null
          created_at?: string | null
          id?: string
          is_winning_bid?: boolean | null
          proxy_max_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "auction_bids_auction_id_fkey"
            columns: ["auction_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      card_favorites: {
        Row: {
          card_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          card_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          card_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "card_favorites_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
      }
      card_recommendations: {
        Row: {
          card_id: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          metadata: Json | null
          recommendation_score: number | null
          recommendation_type: string | null
          user_id: string | null
        }
        Insert: {
          card_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          recommendation_score?: number | null
          recommendation_type?: string | null
          user_id?: string | null
        }
        Update: {
          card_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          recommendation_score?: number | null
          recommendation_type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "card_recommendations_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
      }
      card_templates: {
        Row: {
          category: string
          created_at: string | null
          creator_id: string | null
          description: string | null
          id: string
          is_premium: boolean | null
          is_public: boolean | null
          name: string
          preview_url: string | null
          template_data: Json
          usage_count: number | null
        }
        Insert: {
          category: string
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          id?: string
          is_premium?: boolean | null
          is_public?: boolean | null
          name: string
          preview_url?: string | null
          template_data: Json
          usage_count?: number | null
        }
        Update: {
          category?: string
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          id?: string
          is_premium?: boolean | null
          is_public?: boolean | null
          name?: string
          preview_url?: string | null
          template_data?: Json
          usage_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "card_templates_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cards: {
        Row: {
          abilities: string[] | null
          base_price: number | null
          card_type: Database["public"]["Enums"]["card_type"] | null
          collection_id: string | null
          crd_catalog_inclusion: boolean | null
          created_at: string | null
          creator_id: string
          current_market_value: number | null
          description: string | null
          design_metadata: Json | null
          edition_number: number | null
          favorite_count: number | null
          id: string
          image_url: string | null
          is_public: boolean | null
          mana_cost: Json | null
          marketplace_listing: boolean | null
          power: number | null
          price: number | null
          print_available: boolean | null
          print_metadata: Json | null
          rarity: Database["public"]["Enums"]["card_rarity"] | null
          royalty_percentage: number | null
          serial_number: number | null
          series: string | null
          set_id: string | null
          tags: string[] | null
          team_id: string | null
          template_id: string | null
          thumbnail_url: string | null
          title: string
          total_supply: number | null
          toughness: number | null
          updated_at: string | null
          verification_status: string | null
          view_count: number | null
          visibility: Database["public"]["Enums"]["visibility_type"] | null
        }
        Insert: {
          abilities?: string[] | null
          base_price?: number | null
          card_type?: Database["public"]["Enums"]["card_type"] | null
          collection_id?: string | null
          crd_catalog_inclusion?: boolean | null
          created_at?: string | null
          creator_id: string
          current_market_value?: number | null
          description?: string | null
          design_metadata?: Json | null
          edition_number?: number | null
          favorite_count?: number | null
          id?: string
          image_url?: string | null
          is_public?: boolean | null
          mana_cost?: Json | null
          marketplace_listing?: boolean | null
          power?: number | null
          price?: number | null
          print_available?: boolean | null
          print_metadata?: Json | null
          rarity?: Database["public"]["Enums"]["card_rarity"] | null
          royalty_percentage?: number | null
          serial_number?: number | null
          series?: string | null
          set_id?: string | null
          tags?: string[] | null
          team_id?: string | null
          template_id?: string | null
          thumbnail_url?: string | null
          title: string
          total_supply?: number | null
          toughness?: number | null
          updated_at?: string | null
          verification_status?: string | null
          view_count?: number | null
          visibility?: Database["public"]["Enums"]["visibility_type"] | null
        }
        Update: {
          abilities?: string[] | null
          base_price?: number | null
          card_type?: Database["public"]["Enums"]["card_type"] | null
          collection_id?: string | null
          crd_catalog_inclusion?: boolean | null
          created_at?: string | null
          creator_id?: string
          current_market_value?: number | null
          description?: string | null
          design_metadata?: Json | null
          edition_number?: number | null
          favorite_count?: number | null
          id?: string
          image_url?: string | null
          is_public?: boolean | null
          mana_cost?: Json | null
          marketplace_listing?: boolean | null
          power?: number | null
          price?: number | null
          print_available?: boolean | null
          print_metadata?: Json | null
          rarity?: Database["public"]["Enums"]["card_rarity"] | null
          royalty_percentage?: number | null
          serial_number?: number | null
          series?: string | null
          set_id?: string | null
          tags?: string[] | null
          team_id?: string | null
          template_id?: string | null
          thumbnail_url?: string | null
          title?: string
          total_supply?: number | null
          toughness?: number | null
          updated_at?: string | null
          verification_status?: string | null
          view_count?: number | null
          visibility?: Database["public"]["Enums"]["visibility_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "cards_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cards_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cards_set_id_fkey"
            columns: ["set_id"]
            isOneToOne: false
            referencedRelation: "sets"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_activity_log: {
        Row: {
          action: string
          collection_id: string
          created_at: string | null
          id: string
          metadata: Json | null
          target_id: string | null
          user_id: string
        }
        Insert: {
          action: string
          collection_id: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          target_id?: string | null
          user_id: string
        }
        Update: {
          action?: string
          collection_id?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          target_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_activity_log_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_cards: {
        Row: {
          added_at: string | null
          card_id: string
          collection_id: string
          display_order: number | null
          id: string
        }
        Insert: {
          added_at?: string | null
          card_id: string
          collection_id: string
          display_order?: number | null
          id?: string
        }
        Update: {
          added_at?: string | null
          card_id?: string
          collection_id?: string
          display_order?: number | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_cards_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_cards_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_followers: {
        Row: {
          collection_id: string
          followed_at: string | null
          follower_id: string
          id: string
          notification_settings: Json | null
        }
        Insert: {
          collection_id: string
          followed_at?: string | null
          follower_id: string
          id?: string
          notification_settings?: Json | null
        }
        Update: {
          collection_id?: string
          followed_at?: string | null
          follower_id?: string
          id?: string
          notification_settings?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "collection_followers_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_memberships: {
        Row: {
          can_view_member_cards: boolean | null
          collection_id: string
          id: string
          invited_by: string | null
          joined_at: string | null
          role: string | null
          user_id: string
        }
        Insert: {
          can_view_member_cards?: boolean | null
          collection_id: string
          id?: string
          invited_by?: string | null
          joined_at?: string | null
          role?: string | null
          user_id: string
        }
        Update: {
          can_view_member_cards?: boolean | null
          collection_id?: string
          id?: string
          invited_by?: string | null
          joined_at?: string | null
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_memberships_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_ratings: {
        Row: {
          collection_id: string
          created_at: string | null
          id: string
          rating: number | null
          review: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          collection_id: string
          created_at?: string | null
          id?: string
          rating?: number | null
          review?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          collection_id?: string
          created_at?: string | null
          id?: string
          rating?: number | null
          review?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_ratings_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_templates: {
        Row: {
          card_filters: Json | null
          created_at: string | null
          creator_id: string
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          template_hash: string
          updated_at: string | null
          usage_count: number | null
        }
        Insert: {
          card_filters?: Json | null
          created_at?: string | null
          creator_id: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          template_hash: string
          updated_at?: string | null
          usage_count?: number | null
        }
        Update: {
          card_filters?: Json | null
          created_at?: string | null
          creator_id?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          template_hash?: string
          updated_at?: string | null
          usage_count?: number | null
        }
        Relationships: []
      }
      collections: {
        Row: {
          allow_member_card_sharing: boolean | null
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          group_code: string | null
          id: string
          is_featured: boolean | null
          is_group: boolean | null
          metadata: Json | null
          owner_id: string
          template_id: string | null
          title: string
          updated_at: string | null
          visibility: Database["public"]["Enums"]["visibility_type"] | null
        }
        Insert: {
          allow_member_card_sharing?: boolean | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          group_code?: string | null
          id?: string
          is_featured?: boolean | null
          is_group?: boolean | null
          metadata?: Json | null
          owner_id: string
          template_id?: string | null
          title: string
          updated_at?: string | null
          visibility?: Database["public"]["Enums"]["visibility_type"] | null
        }
        Update: {
          allow_member_card_sharing?: boolean | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          group_code?: string | null
          id?: string
          is_featured?: boolean | null
          is_group?: boolean | null
          metadata?: Json | null
          owner_id?: string
          template_id?: string | null
          title?: string
          updated_at?: string | null
          visibility?: Database["public"]["Enums"]["visibility_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "collections_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collections_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "collection_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          author_id: string
          card_id: string | null
          collection_id: string | null
          content: string
          created_at: string | null
          id: string
          is_edited: boolean | null
          memory_id: string | null
          parent_id: string | null
          updated_at: string | null
        }
        Insert: {
          author_id: string
          card_id?: string | null
          collection_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_edited?: boolean | null
          memory_id?: string | null
          parent_id?: string | null
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          card_id?: string | null
          collection_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_edited?: boolean | null
          memory_id?: string | null
          parent_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_memory_id_fkey"
            columns: ["memory_id"]
            isOneToOne: false
            referencedRelation: "memories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
        ]
      }
      follows: {
        Row: {
          created_at: string | null
          followed_id: string
          follower_id: string
          id: string
        }
        Insert: {
          created_at?: string | null
          followed_id: string
          follower_id: string
          id?: string
        }
        Update: {
          created_at?: string | null
          followed_id?: string
          follower_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follows_followed_id_fkey"
            columns: ["followed_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery_preferences: {
        Row: {
          accessibility_mode: boolean | null
          ambient_lighting: boolean | null
          auto_rotate: boolean | null
          created_at: string | null
          environment_theme: string | null
          id: string
          layout_type: string | null
          navigation_speed: number | null
          particle_effects: boolean | null
          reduced_motion: boolean | null
          spatial_audio: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          accessibility_mode?: boolean | null
          ambient_lighting?: boolean | null
          auto_rotate?: boolean | null
          created_at?: string | null
          environment_theme?: string | null
          id?: string
          layout_type?: string | null
          navigation_speed?: number | null
          particle_effects?: boolean | null
          reduced_motion?: boolean | null
          spatial_audio?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          accessibility_mode?: boolean | null
          ambient_lighting?: boolean | null
          auto_rotate?: boolean | null
          created_at?: string | null
          environment_theme?: string | null
          id?: string
          layout_type?: string | null
          navigation_speed?: number | null
          particle_effects?: boolean | null
          reduced_motion?: boolean | null
          spatial_audio?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      gallery_session_participants: {
        Row: {
          cursor_position: Json | null
          id: string
          is_host: boolean | null
          joined_at: string | null
          last_active: string | null
          session_id: string
          user_id: string
        }
        Insert: {
          cursor_position?: Json | null
          id?: string
          is_host?: boolean | null
          joined_at?: string | null
          last_active?: string | null
          session_id: string
          user_id: string
        }
        Update: {
          cursor_position?: Json | null
          id?: string
          is_host?: boolean | null
          joined_at?: string | null
          last_active?: string | null
          session_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gallery_session_participants_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "shared_gallery_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery_viewing_history: {
        Row: {
          cards_viewed: string[] | null
          collection_id: string
          created_at: string | null
          id: string
          interaction_count: number | null
          last_card_viewed: string | null
          layout_used: string
          session_duration: number | null
          updated_at: string | null
          user_id: string
          viewing_position: Json | null
        }
        Insert: {
          cards_viewed?: string[] | null
          collection_id: string
          created_at?: string | null
          id?: string
          interaction_count?: number | null
          last_card_viewed?: string | null
          layout_used: string
          session_duration?: number | null
          updated_at?: string | null
          user_id: string
          viewing_position?: Json | null
        }
        Update: {
          cards_viewed?: string[] | null
          collection_id?: string
          created_at?: string | null
          id?: string
          interaction_count?: number | null
          last_card_viewed?: string | null
          layout_used?: string
          session_duration?: number | null
          updated_at?: string | null
          user_id?: string
          viewing_position?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "gallery_viewing_history_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gallery_viewing_history_last_card_viewed_fkey"
            columns: ["last_card_viewed"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
      }
      market_analytics: {
        Row: {
          avg_price: number | null
          card_id: string | null
          created_at: string | null
          date: string
          id: string
          liquidity_score: number | null
          market_cap: number | null
          price_change_24h: number | null
          transactions: number | null
          volume: number | null
        }
        Insert: {
          avg_price?: number | null
          card_id?: string | null
          created_at?: string | null
          date: string
          id?: string
          liquidity_score?: number | null
          market_cap?: number | null
          price_change_24h?: number | null
          transactions?: number | null
          volume?: number | null
        }
        Update: {
          avg_price?: number | null
          card_id?: string | null
          created_at?: string | null
          date?: string
          id?: string
          liquidity_score?: number | null
          market_cap?: number | null
          price_change_24h?: number | null
          transactions?: number | null
          volume?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "market_analytics_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_listings: {
        Row: {
          auction_end_time: string | null
          card_id: string
          condition: string
          created_at: string | null
          description: string | null
          estimated_delivery: string | null
          featured: boolean | null
          id: string
          listing_type: string
          location: string | null
          price: number
          quantity: number
          reserve_price: number | null
          seller_id: string
          shipping_cost: number | null
          status: string
          updated_at: string | null
          views: number | null
          watchers_count: number | null
        }
        Insert: {
          auction_end_time?: string | null
          card_id: string
          condition?: string
          created_at?: string | null
          description?: string | null
          estimated_delivery?: string | null
          featured?: boolean | null
          id?: string
          listing_type?: string
          location?: string | null
          price: number
          quantity?: number
          reserve_price?: number | null
          seller_id: string
          shipping_cost?: number | null
          status?: string
          updated_at?: string | null
          views?: number | null
          watchers_count?: number | null
        }
        Update: {
          auction_end_time?: string | null
          card_id?: string
          condition?: string
          created_at?: string | null
          description?: string | null
          estimated_delivery?: string | null
          featured?: boolean | null
          id?: string
          listing_type?: string
          location?: string | null
          price?: number
          quantity?: number
          reserve_price?: number | null
          seller_id?: string
          shipping_cost?: number | null
          status?: string
          updated_at?: string | null
          views?: number | null
          watchers_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_listings_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_offers: {
        Row: {
          amount: number
          buyer_id: string
          created_at: string | null
          expires_at: string | null
          id: string
          listing_id: string
          message: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          buyer_id: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          listing_id: string
          message?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          buyer_id?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          listing_id?: string
          message?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_offers_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_reviews: {
        Row: {
          created_at: string | null
          id: string
          rating: number | null
          review_text: string | null
          review_type: string | null
          reviewed_id: string | null
          reviewer_id: string | null
          transaction_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          rating?: number | null
          review_text?: string | null
          review_type?: string | null
          reviewed_id?: string | null
          reviewer_id?: string | null
          transaction_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          rating?: number | null
          review_text?: string | null
          review_type?: string | null
          reviewed_id?: string | null
          reviewer_id?: string | null
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_reviews_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_watchers: {
        Row: {
          created_at: string | null
          id: string
          listing_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          listing_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          listing_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_watchers_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      media: {
        Row: {
          alt_text: string | null
          bucket_id: string | null
          created_at: string | null
          duration: number | null
          file_name: string
          file_size: number | null
          file_url: string
          height: number | null
          id: string
          metadata: Json | null
          mime_type: string | null
          owner_id: string
          storage_path: string | null
          thumbnail_url: string | null
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          bucket_id?: string | null
          created_at?: string | null
          duration?: number | null
          file_name: string
          file_size?: number | null
          file_url: string
          height?: number | null
          id?: string
          metadata?: Json | null
          mime_type?: string | null
          owner_id: string
          storage_path?: string | null
          thumbnail_url?: string | null
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          bucket_id?: string | null
          created_at?: string | null
          duration?: number | null
          file_name?: string
          file_size?: number | null
          file_url?: string
          height?: number | null
          id?: string
          metadata?: Json | null
          mime_type?: string | null
          owner_id?: string
          storage_path?: string | null
          thumbnail_url?: string | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "media_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      memories: {
        Row: {
          card_id: string | null
          created_at: string | null
          description: string | null
          id: string
          location: Json | null
          metadata: Json | null
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string
          visibility: Database["public"]["Enums"]["visibility_type"] | null
        }
        Insert: {
          card_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          location?: Json | null
          metadata?: Json | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id: string
          visibility?: Database["public"]["Enums"]["visibility_type"] | null
        }
        Update: {
          card_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          location?: Json | null
          metadata?: Json | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string
          visibility?: Database["public"]["Enums"]["visibility_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "memories_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          actor_id: string | null
          created_at: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          is_read: boolean | null
          message: string | null
          recipient_id: string
          title: string
          type: Database["public"]["Enums"]["notification_type"]
        }
        Insert: {
          actor_id?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          recipient_id: string
          title: string
          type: Database["public"]["Enums"]["notification_type"]
        }
        Update: {
          actor_id?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          recipient_id?: string
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
        }
        Relationships: [
          {
            foreignKeyName: "notifications_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_tracking: {
        Row: {
          card_id: string | null
          created_at: string | null
          current_value: number | null
          id: string
          purchase_date: string | null
          purchase_price: number | null
          quantity: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          card_id?: string | null
          created_at?: string | null
          current_value?: number | null
          id?: string
          purchase_date?: string | null
          purchase_price?: number | null
          quantity?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          card_id?: string | null
          created_at?: string | null
          current_value?: number | null
          id?: string
          purchase_date?: string | null
          purchase_price?: number | null
          quantity?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_tracking_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          full_name: string | null
          id: string
          location: string | null
          preferences: Json | null
          updated_at: string | null
          username: string
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          location?: string | null
          preferences?: Json | null
          updated_at?: string | null
          username: string
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          location?: string | null
          preferences?: Json | null
          updated_at?: string | null
          username?: string
          website?: string | null
        }
        Relationships: []
      }
      reactions: {
        Row: {
          card_id: string | null
          collection_id: string | null
          comment_id: string | null
          created_at: string | null
          id: string
          memory_id: string | null
          type: Database["public"]["Enums"]["reaction_type"]
          user_id: string
        }
        Insert: {
          card_id?: string | null
          collection_id?: string | null
          comment_id?: string | null
          created_at?: string | null
          id?: string
          memory_id?: string | null
          type: Database["public"]["Enums"]["reaction_type"]
          user_id: string
        }
        Update: {
          card_id?: string | null
          collection_id?: string | null
          comment_id?: string | null
          created_at?: string | null
          id?: string
          memory_id?: string | null
          type?: Database["public"]["Enums"]["reaction_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reactions_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reactions_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reactions_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reactions_memory_id_fkey"
            columns: ["memory_id"]
            isOneToOne: false
            referencedRelation: "memories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      seller_profiles: {
        Row: {
          business_type: string | null
          charges_enabled: boolean | null
          created_at: string | null
          id: string
          payout_enabled: boolean | null
          rating: number | null
          stripe_account_id: string | null
          total_revenue: number | null
          total_sales: number | null
          updated_at: string | null
          user_id: string
          verification_status: string | null
        }
        Insert: {
          business_type?: string | null
          charges_enabled?: boolean | null
          created_at?: string | null
          id?: string
          payout_enabled?: boolean | null
          rating?: number | null
          stripe_account_id?: string | null
          total_revenue?: number | null
          total_sales?: number | null
          updated_at?: string | null
          user_id: string
          verification_status?: string | null
        }
        Update: {
          business_type?: string | null
          charges_enabled?: boolean | null
          created_at?: string | null
          id?: string
          payout_enabled?: boolean | null
          rating?: number | null
          stripe_account_id?: string | null
          total_revenue?: number | null
          total_sales?: number | null
          updated_at?: string | null
          user_id?: string
          verification_status?: string | null
        }
        Relationships: []
      }
      sets: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          release_date: string | null
          total_cards: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          release_date?: string | null
          total_cards?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          release_date?: string | null
          total_cards?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      shader_performance_logs: {
        Row: {
          compilation_time_ms: number | null
          device_info: Json | null
          fps_average: number | null
          id: string
          quality_preset: string | null
          render_time_ms: number | null
          shader_type: string | null
          timestamp: string
          user_id: string | null
        }
        Insert: {
          compilation_time_ms?: number | null
          device_info?: Json | null
          fps_average?: number | null
          id?: string
          quality_preset?: string | null
          render_time_ms?: number | null
          shader_type?: string | null
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          compilation_time_ms?: number | null
          device_info?: Json | null
          fps_average?: number | null
          id?: string
          quality_preset?: string | null
          render_time_ms?: number | null
          shader_type?: string | null
          timestamp?: string
          user_id?: string | null
        }
        Relationships: []
      }
      shared_gallery_sessions: {
        Row: {
          collection_id: string
          created_at: string | null
          current_participants: number | null
          expires_at: string | null
          host_user_id: string
          id: string
          is_active: boolean | null
          layout_type: string | null
          max_participants: number | null
          session_code: string
        }
        Insert: {
          collection_id: string
          created_at?: string | null
          current_participants?: number | null
          expires_at?: string | null
          host_user_id: string
          id?: string
          is_active?: boolean | null
          layout_type?: string | null
          max_participants?: number | null
          session_code?: string
        }
        Update: {
          collection_id?: string
          created_at?: string | null
          current_participants?: number | null
          expires_at?: string | null
          host_user_id?: string
          id?: string
          is_active?: boolean | null
          layout_type?: string | null
          max_participants?: number | null
          session_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "shared_gallery_sessions_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          name: string
          usage_count: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          name: string
          usage_count?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          name?: string
          usage_count?: number | null
        }
        Relationships: []
      }
      trade_feedback: {
        Row: {
          created_at: string | null
          feedback_text: string | null
          id: string
          rating: number | null
          reviewed_id: string
          reviewer_id: string
          trade_id: string
        }
        Insert: {
          created_at?: string | null
          feedback_text?: string | null
          id?: string
          rating?: number | null
          reviewed_id: string
          reviewer_id: string
          trade_id: string
        }
        Update: {
          created_at?: string | null
          feedback_text?: string | null
          id?: string
          rating?: number | null
          reviewed_id?: string
          reviewer_id?: string
          trade_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trade_feedback_trade_id_fkey"
            columns: ["trade_id"]
            isOneToOne: false
            referencedRelation: "trade_offers"
            referencedColumns: ["id"]
          },
        ]
      }
      trade_messages: {
        Row: {
          attachment_url: string | null
          id: string
          message: string
          message_type: string | null
          metadata: Json | null
          read_status: boolean | null
          sender_id: string
          timestamp: string | null
          trade_id: string
        }
        Insert: {
          attachment_url?: string | null
          id?: string
          message: string
          message_type?: string | null
          metadata?: Json | null
          read_status?: boolean | null
          sender_id: string
          timestamp?: string | null
          trade_id: string
        }
        Update: {
          attachment_url?: string | null
          id?: string
          message?: string
          message_type?: string | null
          metadata?: Json | null
          read_status?: boolean | null
          sender_id?: string
          timestamp?: string | null
          trade_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trade_messages_trade_id_fkey"
            columns: ["trade_id"]
            isOneToOne: false
            referencedRelation: "trade_offers"
            referencedColumns: ["id"]
          },
        ]
      }
      trade_offers: {
        Row: {
          cash_included: number | null
          completed_at: string | null
          counter_offer_id: string | null
          created_at: string | null
          expires_at: string
          id: string
          initiator_id: string
          messages_channel_id: string | null
          metadata: Json | null
          offered_cards: Json
          recipient_id: string
          requested_cards: Json
          status: string
          trade_note: string | null
          trade_value_difference: number | null
          updated_at: string | null
        }
        Insert: {
          cash_included?: number | null
          completed_at?: string | null
          counter_offer_id?: string | null
          created_at?: string | null
          expires_at?: string
          id?: string
          initiator_id: string
          messages_channel_id?: string | null
          metadata?: Json | null
          offered_cards?: Json
          recipient_id: string
          requested_cards?: Json
          status?: string
          trade_note?: string | null
          trade_value_difference?: number | null
          updated_at?: string | null
        }
        Update: {
          cash_included?: number | null
          completed_at?: string | null
          counter_offer_id?: string | null
          created_at?: string | null
          expires_at?: string
          id?: string
          initiator_id?: string
          messages_channel_id?: string | null
          metadata?: Json | null
          offered_cards?: Json
          recipient_id?: string
          requested_cards?: Json
          status?: string
          trade_note?: string | null
          trade_value_difference?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trade_offers_counter_offer_id_fkey"
            columns: ["counter_offer_id"]
            isOneToOne: false
            referencedRelation: "trade_offers"
            referencedColumns: ["id"]
          },
        ]
      }
      trade_participants: {
        Row: {
          id: string
          is_typing: boolean | null
          last_seen: string | null
          presence_status: string | null
          trade_id: string
          user_id: string
        }
        Insert: {
          id?: string
          is_typing?: boolean | null
          last_seen?: string | null
          presence_status?: string | null
          trade_id: string
          user_id: string
        }
        Update: {
          id?: string
          is_typing?: boolean | null
          last_seen?: string | null
          presence_status?: string | null
          trade_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trade_participants_trade_id_fkey"
            columns: ["trade_id"]
            isOneToOne: false
            referencedRelation: "trade_offers"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          buyer_id: string
          completed_at: string | null
          created_at: string | null
          id: string
          listing_id: string
          platform_fee: number
          refunded_at: string | null
          seller_id: string
          shipping_info: Json | null
          status: string
          stripe_payment_intent_id: string | null
          stripe_transfer_id: string | null
          tracking_number: string | null
        }
        Insert: {
          amount: number
          buyer_id: string
          completed_at?: string | null
          created_at?: string | null
          id?: string
          listing_id: string
          platform_fee: number
          refunded_at?: string | null
          seller_id: string
          shipping_info?: Json | null
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_transfer_id?: string | null
          tracking_number?: string | null
        }
        Update: {
          amount?: number
          buyer_id?: string
          completed_at?: string | null
          created_at?: string | null
          id?: string
          listing_id?: string
          platform_fee?: number
          refunded_at?: string | null
          seller_id?: string
          shipping_info?: Json | null
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_transfer_id?: string | null
          tracking_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      user_3d_preferences: {
        Row: {
          accessibility_mode: boolean | null
          battery_optimization: boolean | null
          created_at: string
          custom_settings: Json | null
          enable_animations: boolean | null
          enable_haptics: boolean | null
          enable_particles: boolean | null
          enable_shaders: boolean | null
          enable_sound: boolean | null
          id: string
          quality_preset: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          accessibility_mode?: boolean | null
          battery_optimization?: boolean | null
          created_at?: string
          custom_settings?: Json | null
          enable_animations?: boolean | null
          enable_haptics?: boolean | null
          enable_particles?: boolean | null
          enable_shaders?: boolean | null
          enable_sound?: boolean | null
          id?: string
          quality_preset?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          accessibility_mode?: boolean | null
          battery_optimization?: boolean | null
          created_at?: string
          custom_settings?: Json | null
          enable_animations?: boolean | null
          enable_haptics?: boolean | null
          enable_particles?: boolean | null
          enable_shaders?: boolean | null
          enable_sound?: boolean | null
          id?: string
          quality_preset?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_trade_preferences: {
        Row: {
          auto_accept_threshold: number | null
          blocked_users: string[] | null
          created_at: string | null
          id: string
          notification_preferences: Json | null
          preferred_trade_types: string[] | null
          surplus_cards: string[] | null
          updated_at: string | null
          user_id: string
          wishlist_cards: string[] | null
        }
        Insert: {
          auto_accept_threshold?: number | null
          blocked_users?: string[] | null
          created_at?: string | null
          id?: string
          notification_preferences?: Json | null
          preferred_trade_types?: string[] | null
          surplus_cards?: string[] | null
          updated_at?: string | null
          user_id: string
          wishlist_cards?: string[] | null
        }
        Update: {
          auto_accept_threshold?: number | null
          blocked_users?: string[] | null
          created_at?: string | null
          id?: string
          notification_preferences?: Json | null
          preferred_trade_types?: string[] | null
          surplus_cards?: string[] | null
          updated_at?: string | null
          user_id?: string
          wishlist_cards?: string[] | null
        }
        Relationships: []
      }
      user_watchlists: {
        Row: {
          alert_conditions: Json | null
          alert_enabled: boolean | null
          created_at: string | null
          id: string
          name: string
          search_criteria: Json
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          alert_conditions?: Json | null
          alert_enabled?: boolean | null
          created_at?: string | null
          id?: string
          name: string
          search_criteria?: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          alert_conditions?: Json | null
          alert_enabled?: boolean | null
          created_at?: string | null
          id?: string
          name?: string
          search_criteria?: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_platform_fee: {
        Args: { amount: number }
        Returns: number
      }
      create_collection_from_template: {
        Args: { template_id: string; collection_title: string; user_id: string }
        Returns: string
      }
      expire_old_trades: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      generate_group_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_collection_stats: {
        Args: { collection_uuid: string }
        Returns: {
          total_cards: number
          unique_cards: number
          total_value: number
          completion_percentage: number
          last_updated: string
        }[]
      }
      increment_listing_views: {
        Args: { listing_uuid: string }
        Returns: undefined
      }
      is_admin: {
        Args: { user_uuid?: string }
        Returns: boolean
      }
      place_bid: {
        Args: { p_auction_id: string; p_amount: number; p_proxy_max?: number }
        Returns: string
      }
      update_market_analytics: {
        Args: { p_card_id: string; p_sale_price: number }
        Returns: undefined
      }
    }
    Enums: {
      card_rarity:
        | "common"
        | "uncommon"
        | "rare"
        | "epic"
        | "legendary"
        | "mythic"
      card_type:
        | "athlete"
        | "creature"
        | "spell"
        | "artifact"
        | "vehicle"
        | "character"
      media_type: "image" | "video" | "audio"
      notification_type:
        | "comment"
        | "reaction"
        | "follow"
        | "card_shared"
        | "collection_shared"
      reaction_type: "like" | "love" | "wow" | "laugh" | "angry" | "sad"
      visibility_type: "public" | "private" | "shared"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      card_rarity: [
        "common",
        "uncommon",
        "rare",
        "epic",
        "legendary",
        "mythic",
      ],
      card_type: [
        "athlete",
        "creature",
        "spell",
        "artifact",
        "vehicle",
        "character",
      ],
      media_type: ["image", "video", "audio"],
      notification_type: [
        "comment",
        "reaction",
        "follow",
        "card_shared",
        "collection_shared",
      ],
      reaction_type: ["like", "love", "wow", "laugh", "angry", "sad"],
      visibility_type: ["public", "private", "shared"],
    },
  },
} as const
