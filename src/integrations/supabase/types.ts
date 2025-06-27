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
      admin_permissions: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          permission_name: string
        }
        Insert: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          permission_name: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          permission_name?: string
        }
        Relationships: []
      }
      admin_role_permissions: {
        Row: {
          granted_at: string | null
          id: string
          permission_id: string | null
          role: string
        }
        Insert: {
          granted_at?: string | null
          id?: string
          permission_id?: string | null
          role: string
        }
        Update: {
          granted_at?: string | null
          id?: string
          permission_id?: string | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "admin_permissions"
            referencedColumns: ["id"]
          },
        ]
      }
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
      api_usage: {
        Row: {
          created_at: string | null
          endpoint: string
          id: string
          ip_address: unknown | null
          method: string
          request_size_bytes: number | null
          response_size_bytes: number | null
          response_status: number | null
          response_time_ms: number | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          endpoint: string
          id?: string
          ip_address?: unknown | null
          method: string
          request_size_bytes?: number | null
          response_size_bytes?: number | null
          response_status?: number | null
          response_time_ms?: number | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          endpoint?: string
          id?: string
          ip_address?: unknown | null
          method?: string
          request_size_bytes?: number | null
          response_size_bytes?: number | null
          response_status?: number | null
          response_time_ms?: number | null
          user_agent?: string | null
          user_id?: string | null
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
      audit_logs: {
        Row: {
          action: string
          automated_action: boolean | null
          created_at: string | null
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          resource_id: string | null
          resource_type: string
          reviewed_at: string | null
          reviewed_by: string | null
          risk_score: number | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          automated_action?: boolean | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          risk_score?: number | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          automated_action?: boolean | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          risk_score?: number | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      beta_feedback: {
        Row: {
          actual_behavior: string | null
          browser_info: Json | null
          category: string
          created_at: string | null
          description: string
          expected_behavior: string | null
          feedback_type: string
          id: string
          priority: string
          status: string
          steps_to_reproduce: string | null
          title: string
          updated_at: string | null
          user_id: string | null
          user_rating: number | null
        }
        Insert: {
          actual_behavior?: string | null
          browser_info?: Json | null
          category?: string
          created_at?: string | null
          description: string
          expected_behavior?: string | null
          feedback_type: string
          id?: string
          priority?: string
          status?: string
          steps_to_reproduce?: string | null
          title: string
          updated_at?: string | null
          user_id?: string | null
          user_rating?: number | null
        }
        Update: {
          actual_behavior?: string | null
          browser_info?: Json | null
          category?: string
          created_at?: string | null
          description?: string
          expected_behavior?: string | null
          feedback_type?: string
          id?: string
          priority?: string
          status?: string
          steps_to_reproduce?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
          user_rating?: number | null
        }
        Relationships: []
      }
      bi_reports: {
        Row: {
          config: Json
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          last_run_at: string | null
          name: string
          next_run_at: string | null
          report_type: string
          schedule: string | null
        }
        Insert: {
          config: Json
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          last_run_at?: string | null
          name: string
          next_run_at?: string | null
          report_type: string
          schedule?: string | null
        }
        Update: {
          config?: Json
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          last_run_at?: string | null
          name?: string
          next_run_at?: string | null
          report_type?: string
          schedule?: string | null
        }
        Relationships: []
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
      card_sets: {
        Row: {
          cover_image_url: string | null
          created_at: string | null
          creator_id: string
          description: string | null
          id: string
          is_published: boolean | null
          metadata: Json | null
          name: string
          price: number | null
          release_date: string | null
          royalty_percentage: number | null
          total_cards: number | null
          updated_at: string | null
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string | null
          creator_id: string
          description?: string | null
          id?: string
          is_published?: boolean | null
          metadata?: Json | null
          name: string
          price?: number | null
          release_date?: string | null
          royalty_percentage?: number | null
          total_cards?: number | null
          updated_at?: string | null
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string | null
          creator_id?: string
          description?: string | null
          id?: string
          is_published?: boolean | null
          metadata?: Json | null
          name?: string
          price?: number | null
          release_date?: string | null
          royalty_percentage?: number | null
          total_cards?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "card_sets_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
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
      card_templates_creator: {
        Row: {
          category: string
          created_at: string | null
          creator_id: string | null
          description: string | null
          id: string
          is_published: boolean | null
          license_type: string | null
          name: string
          preview_images: string[] | null
          price: number
          rating: number | null
          revenue_generated: number | null
          sales_count: number | null
          tags: string[] | null
          template_data: Json
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          id?: string
          is_published?: boolean | null
          license_type?: string | null
          name: string
          preview_images?: string[] | null
          price?: number
          rating?: number | null
          revenue_generated?: number | null
          sales_count?: number | null
          tags?: string[] | null
          template_data?: Json
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          id?: string
          is_published?: boolean | null
          license_type?: string | null
          name?: string
          preview_images?: string[] | null
          price?: number
          rating?: number | null
          revenue_generated?: number | null
          sales_count?: number | null
          tags?: string[] | null
          template_data?: Json
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "card_templates_creator_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cards: {
        Row: {
          abilities: string[] | null
          base_price: number | null
          card_set_id: string | null
          card_type: Database["public"]["Enums"]["card_type"] | null
          collection_id: string | null
          completed_at: string | null
          crd_catalog_inclusion: boolean | null
          created_at: string | null
          creator_id: string
          current_market_value: number | null
          current_supply: number | null
          description: string | null
          design_metadata: Json | null
          edition_number: number | null
          favorite_count: number | null
          id: string
          image_url: string | null
          is_public: boolean | null
          is_tradeable: boolean | null
          mana_cost: Json | null
          marketplace_listing: boolean | null
          name: string | null
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
          card_set_id?: string | null
          card_type?: Database["public"]["Enums"]["card_type"] | null
          collection_id?: string | null
          completed_at?: string | null
          crd_catalog_inclusion?: boolean | null
          created_at?: string | null
          creator_id: string
          current_market_value?: number | null
          current_supply?: number | null
          description?: string | null
          design_metadata?: Json | null
          edition_number?: number | null
          favorite_count?: number | null
          id?: string
          image_url?: string | null
          is_public?: boolean | null
          is_tradeable?: boolean | null
          mana_cost?: Json | null
          marketplace_listing?: boolean | null
          name?: string | null
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
          card_set_id?: string | null
          card_type?: Database["public"]["Enums"]["card_type"] | null
          collection_id?: string | null
          completed_at?: string | null
          crd_catalog_inclusion?: boolean | null
          created_at?: string | null
          creator_id?: string
          current_market_value?: number | null
          current_supply?: number | null
          description?: string | null
          design_metadata?: Json | null
          edition_number?: number | null
          favorite_count?: number | null
          id?: string
          image_url?: string | null
          is_public?: boolean | null
          is_tradeable?: boolean | null
          mana_cost?: Json | null
          marketplace_listing?: boolean | null
          name?: string | null
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
            foreignKeyName: "cards_card_set_id_fkey"
            columns: ["card_set_id"]
            isOneToOne: false
            referencedRelation: "card_sets"
            referencedColumns: ["id"]
          },
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
      challenge_participations: {
        Row: {
          challenge_id: string | null
          completed_at: string | null
          created_at: string | null
          id: string
          ranking: number | null
          score: number | null
          submission_data: Json | null
          user_id: string | null
        }
        Insert: {
          challenge_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          ranking?: number | null
          score?: number | null
          submission_data?: Json | null
          user_id?: string | null
        }
        Update: {
          challenge_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          ranking?: number | null
          score?: number | null
          submission_data?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "challenge_participations_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "community_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_submissions: {
        Row: {
          card_id: string | null
          challenge_id: string | null
          creator_id: string | null
          feedback: string | null
          id: string
          is_winner: boolean | null
          prize_amount: number | null
          ranking: number | null
          score: number | null
          submission_description: string | null
          submission_title: string | null
          submitted_at: string | null
        }
        Insert: {
          card_id?: string | null
          challenge_id?: string | null
          creator_id?: string | null
          feedback?: string | null
          id?: string
          is_winner?: boolean | null
          prize_amount?: number | null
          ranking?: number | null
          score?: number | null
          submission_description?: string | null
          submission_title?: string | null
          submitted_at?: string | null
        }
        Update: {
          card_id?: string | null
          challenge_id?: string | null
          creator_id?: string | null
          feedback?: string | null
          id?: string
          is_winner?: boolean | null
          prize_amount?: number | null
          ranking?: number | null
          score?: number | null
          submission_description?: string | null
          submission_title?: string | null
          submitted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "challenge_submissions_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenge_submissions_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "creator_challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenge_submissions_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      collaboration_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          layer_id: string | null
          position: Json | null
          project_id: string
          replies: Json
          resolved: boolean
          updated_at: string
          user_id: string
          username: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          layer_id?: string | null
          position?: Json | null
          project_id: string
          replies?: Json
          resolved?: boolean
          updated_at?: string
          user_id: string
          username: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          layer_id?: string | null
          position?: Json | null
          project_id?: string
          replies?: Json
          resolved?: boolean
          updated_at?: string
          user_id?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "collaboration_comments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "design_projects"
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
          added_by: string | null
          card_id: string
          collection_id: string
          display_order: number | null
          id: string
          notes: string | null
          quantity: number | null
        }
        Insert: {
          added_at?: string | null
          added_by?: string | null
          card_id: string
          collection_id: string
          display_order?: number | null
          id?: string
          notes?: string | null
          quantity?: number | null
        }
        Update: {
          added_at?: string | null
          added_by?: string | null
          card_id?: string
          collection_id?: string
          display_order?: number | null
          id?: string
          notes?: string | null
          quantity?: number | null
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
          name: string | null
          template_id: string | null
          title: string
          updated_at: string | null
          user_id: string
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
          name?: string | null
          template_id?: string | null
          title: string
          updated_at?: string | null
          user_id: string
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
          name?: string | null
          template_id?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
          visibility?: Database["public"]["Enums"]["visibility_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "collections_owner_id_fkey"
            columns: ["user_id"]
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
      community_challenges: {
        Row: {
          challenge_type: string
          created_at: string | null
          created_by: string | null
          description: string | null
          end_date: string | null
          entry_requirements: Json | null
          id: string
          max_participants: number | null
          participant_count: number | null
          prize_pool: number | null
          rules: Json | null
          start_date: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          challenge_type: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          entry_requirements?: Json | null
          id?: string
          max_participants?: number | null
          participant_count?: number | null
          prize_pool?: number | null
          rules?: Json | null
          start_date?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          challenge_type?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          entry_requirements?: Json | null
          id?: string
          max_participants?: number | null
          participant_count?: number | null
          prize_pool?: number | null
          rules?: Json | null
          start_date?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      content_moderation: {
        Row: {
          automated_checks: Json | null
          community_votes: Json | null
          confidence_score: number | null
          content_id: string
          content_type: string
          created_at: string | null
          flags: Json | null
          id: string
          moderation_type: string
          review_notes: string | null
          reviewer_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          automated_checks?: Json | null
          community_votes?: Json | null
          confidence_score?: number | null
          content_id: string
          content_type: string
          created_at?: string | null
          flags?: Json | null
          id?: string
          moderation_type: string
          review_notes?: string | null
          reviewer_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          automated_checks?: Json | null
          community_votes?: Json | null
          confidence_score?: number | null
          content_id?: string
          content_type?: string
          created_at?: string | null
          flags?: Json | null
          id?: string
          moderation_type?: string
          review_notes?: string | null
          reviewer_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_moderation_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      content_moderation_queue: {
        Row: {
          ai_flags: Json | null
          assigned_to: string | null
          content_id: string
          content_type: string
          created_at: string | null
          id: string
          moderator_notes: string | null
          priority: string | null
          reported_by: string | null
          resolution_reason: string | null
          resolved_at: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          ai_flags?: Json | null
          assigned_to?: string | null
          content_id: string
          content_type: string
          created_at?: string | null
          id?: string
          moderator_notes?: string | null
          priority?: string | null
          reported_by?: string | null
          resolution_reason?: string | null
          resolved_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          ai_flags?: Json | null
          assigned_to?: string | null
          content_id?: string
          content_type?: string
          created_at?: string | null
          id?: string
          moderator_notes?: string | null
          priority?: string | null
          reported_by?: string | null
          resolution_reason?: string | null
          resolved_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      course_enrollments: {
        Row: {
          certificate_issued: boolean | null
          completed_at: string | null
          course_id: string | null
          creator_id: string | null
          enrolled_at: string | null
          id: string
          progress_percentage: number | null
          rating: number | null
          review: string | null
        }
        Insert: {
          certificate_issued?: boolean | null
          completed_at?: string | null
          course_id?: string | null
          creator_id?: string | null
          enrolled_at?: string | null
          id?: string
          progress_percentage?: number | null
          rating?: number | null
          review?: string | null
        }
        Update: {
          certificate_issued?: boolean | null
          completed_at?: string | null
          course_id?: string | null
          creator_id?: string | null
          enrolled_at?: string | null
          id?: string
          progress_percentage?: number | null
          rating?: number | null
          review?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "creator_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_enrollments_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      crd_elements: {
        Row: {
          asset_urls: Json | null
          category: string | null
          config: Json
          created_at: string | null
          creator_id: string | null
          description: string | null
          download_count: number | null
          element_type: string
          id: string
          is_free: boolean | null
          is_public: boolean | null
          name: string
          preview_image_url: string | null
          price_cents: number | null
          rating_average: number | null
          rating_count: number | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          asset_urls?: Json | null
          category?: string | null
          config?: Json
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          download_count?: number | null
          element_type: string
          id?: string
          is_free?: boolean | null
          is_public?: boolean | null
          name: string
          preview_image_url?: string | null
          price_cents?: number | null
          rating_average?: number | null
          rating_count?: number | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          asset_urls?: Json | null
          category?: string | null
          config?: Json
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          download_count?: number | null
          element_type?: string
          id?: string
          is_free?: boolean | null
          is_public?: boolean | null
          name?: string
          preview_image_url?: string | null
          price_cents?: number | null
          rating_average?: number | null
          rating_count?: number | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      crd_frames: {
        Row: {
          category: string | null
          created_at: string | null
          creator_id: string | null
          description: string | null
          download_count: number | null
          frame_config: Json
          id: string
          included_elements: string[] | null
          is_public: boolean | null
          name: string
          preview_image_url: string | null
          price_cents: number | null
          rating_average: number | null
          rating_count: number | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          download_count?: number | null
          frame_config: Json
          id?: string
          included_elements?: string[] | null
          is_public?: boolean | null
          name: string
          preview_image_url?: string | null
          price_cents?: number | null
          rating_average?: number | null
          rating_count?: number | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          download_count?: number | null
          frame_config?: Json
          id?: string
          included_elements?: string[] | null
          is_public?: boolean | null
          name?: string
          preview_image_url?: string | null
          price_cents?: number | null
          rating_average?: number | null
          rating_count?: number | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      creator_activities: {
        Row: {
          activity_data: Json
          activity_type: string
          created_at: string | null
          creator_id: string | null
          id: string
          visibility: string | null
        }
        Insert: {
          activity_data?: Json
          activity_type: string
          created_at?: string | null
          creator_id?: string | null
          id?: string
          visibility?: string | null
        }
        Update: {
          activity_data?: Json
          activity_type?: string
          created_at?: string | null
          creator_id?: string | null
          id?: string
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_activities_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_analytics: {
        Row: {
          aggregation_level: string | null
          created_at: string | null
          creator_id: string | null
          id: string
          metadata: Json | null
          metric_type: string
          metric_value: number
          period_end: string
          period_start: string
        }
        Insert: {
          aggregation_level?: string | null
          created_at?: string | null
          creator_id?: string | null
          id?: string
          metadata?: Json | null
          metric_type: string
          metric_value: number
          period_end: string
          period_start: string
        }
        Update: {
          aggregation_level?: string | null
          created_at?: string | null
          creator_id?: string | null
          id?: string
          metadata?: Json | null
          metric_type?: string
          metric_value?: number
          period_end?: string
          period_start?: string
        }
        Relationships: [
          {
            foreignKeyName: "creator_analytics_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_automation_rules: {
        Row: {
          actions: Json
          conditions: Json
          created_at: string | null
          creator_id: string | null
          execution_count: number | null
          id: string
          is_active: boolean | null
          last_executed: string | null
          rule_type: string
          success_rate: number | null
          updated_at: string | null
        }
        Insert: {
          actions?: Json
          conditions?: Json
          created_at?: string | null
          creator_id?: string | null
          execution_count?: number | null
          id?: string
          is_active?: boolean | null
          last_executed?: string | null
          rule_type: string
          success_rate?: number | null
          updated_at?: string | null
        }
        Update: {
          actions?: Json
          conditions?: Json
          created_at?: string | null
          creator_id?: string | null
          execution_count?: number | null
          id?: string
          is_active?: boolean | null
          last_executed?: string | null
          rule_type?: string
          success_rate?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_automation_rules_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_brands: {
        Row: {
          brand_description: string | null
          brand_name: string
          brand_verification_status: string | null
          created_at: string | null
          creator_id: string | null
          custom_css: string | null
          custom_domain: string | null
          id: string
          logo_url: string | null
          primary_color: string | null
          secondary_color: string | null
          social_links: Json | null
          updated_at: string | null
          white_label_enabled: boolean | null
        }
        Insert: {
          brand_description?: string | null
          brand_name: string
          brand_verification_status?: string | null
          created_at?: string | null
          creator_id?: string | null
          custom_css?: string | null
          custom_domain?: string | null
          id?: string
          logo_url?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          social_links?: Json | null
          updated_at?: string | null
          white_label_enabled?: boolean | null
        }
        Update: {
          brand_description?: string | null
          brand_name?: string
          brand_verification_status?: string | null
          created_at?: string | null
          creator_id?: string | null
          custom_css?: string | null
          custom_domain?: string | null
          id?: string
          logo_url?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          social_links?: Json | null
          updated_at?: string | null
          white_label_enabled?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_brands_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_challenges: {
        Row: {
          challenge_type: string
          created_at: string | null
          created_by: string | null
          current_participants: number | null
          description: string
          difficulty_level: string | null
          end_date: string | null
          entry_fee: number | null
          id: string
          judging_criteria: Json | null
          max_participants: number | null
          prize_pool: number | null
          rules: Json | null
          start_date: string | null
          status: string | null
          submission_deadline: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          challenge_type: string
          created_at?: string | null
          created_by?: string | null
          current_participants?: number | null
          description: string
          difficulty_level?: string | null
          end_date?: string | null
          entry_fee?: number | null
          id?: string
          judging_criteria?: Json | null
          max_participants?: number | null
          prize_pool?: number | null
          rules?: Json | null
          start_date?: string | null
          status?: string | null
          submission_deadline?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          challenge_type?: string
          created_at?: string | null
          created_by?: string | null
          current_participants?: number | null
          description?: string
          difficulty_level?: string | null
          end_date?: string | null
          entry_fee?: number | null
          id?: string
          judging_criteria?: Json | null
          max_participants?: number | null
          prize_pool?: number | null
          rules?: Json | null
          start_date?: string | null
          status?: string | null
          submission_deadline?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_challenges_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_collaborations: {
        Row: {
          collaborators: string[]
          completion_date: string | null
          created_at: string | null
          deadline: string | null
          id: string
          ownership_split: Json
          project_id: string
          project_type: string
          revenue_sharing_agreement: Json
          status: string
          updated_at: string | null
        }
        Insert: {
          collaborators?: string[]
          completion_date?: string | null
          created_at?: string | null
          deadline?: string | null
          id?: string
          ownership_split?: Json
          project_id: string
          project_type: string
          revenue_sharing_agreement?: Json
          status?: string
          updated_at?: string | null
        }
        Update: {
          collaborators?: string[]
          completion_date?: string | null
          created_at?: string | null
          deadline?: string | null
          id?: string
          ownership_split?: Json
          project_id?: string
          project_type?: string
          revenue_sharing_agreement?: Json
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      creator_commissions: {
        Row: {
          client_id: string | null
          commission_type: string
          communication_channel: string | null
          created_at: string | null
          creator_id: string | null
          deadline: string | null
          deliverables: string[] | null
          description: string
          final_price: number | null
          id: string
          quoted_price: number
          requirements: Json | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          commission_type: string
          communication_channel?: string | null
          created_at?: string | null
          creator_id?: string | null
          deadline?: string | null
          deliverables?: string[] | null
          description: string
          final_price?: number | null
          id?: string
          quoted_price: number
          requirements?: Json | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          commission_type?: string
          communication_channel?: string | null
          created_at?: string | null
          creator_id?: string | null
          deadline?: string | null
          deliverables?: string[] | null
          description?: string
          final_price?: number | null
          id?: string
          quoted_price?: number
          requirements?: Json | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_commissions_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_courses: {
        Row: {
          course_materials: Json | null
          course_type: string | null
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          enrollment_count: number | null
          id: string
          instructor_id: string | null
          is_free: boolean | null
          is_published: boolean | null
          learning_objectives: string[] | null
          prerequisites: string[] | null
          price: number | null
          rating: number | null
          skill_level: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          course_materials?: Json | null
          course_type?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          enrollment_count?: number | null
          id?: string
          instructor_id?: string | null
          is_free?: boolean | null
          is_published?: boolean | null
          learning_objectives?: string[] | null
          prerequisites?: string[] | null
          price?: number | null
          rating?: number | null
          skill_level?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          course_materials?: Json | null
          course_type?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          enrollment_count?: number | null
          id?: string
          instructor_id?: string | null
          is_free?: boolean | null
          is_published?: boolean | null
          learning_objectives?: string[] | null
          prerequisites?: string[] | null
          price?: number | null
          rating?: number | null
          skill_level?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_courses_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_earnings: {
        Row: {
          amount: number
          card_id: string | null
          created_at: string | null
          creator_id: string | null
          id: string
          metadata: Json | null
          net_amount: number | null
          payout_date: string | null
          platform_fee: number
          source_type: string
          status: string | null
          stripe_transfer_id: string | null
          tax_document_id: string | null
          template_id: string | null
          transaction_date: string | null
        }
        Insert: {
          amount: number
          card_id?: string | null
          created_at?: string | null
          creator_id?: string | null
          id?: string
          metadata?: Json | null
          net_amount?: number | null
          payout_date?: string | null
          platform_fee?: number
          source_type: string
          status?: string | null
          stripe_transfer_id?: string | null
          tax_document_id?: string | null
          template_id?: string | null
          transaction_date?: string | null
        }
        Update: {
          amount?: number
          card_id?: string | null
          created_at?: string | null
          creator_id?: string | null
          id?: string
          metadata?: Json | null
          net_amount?: number | null
          payout_date?: string | null
          platform_fee?: number
          source_type?: string
          status?: string | null
          stripe_transfer_id?: string | null
          tax_document_id?: string | null
          template_id?: string | null
          transaction_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_earnings_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creator_earnings_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creator_earnings_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "card_templates_creator"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_follows: {
        Row: {
          followed_at: string | null
          follower_id: string | null
          following_id: string | null
          id: string
          notification_settings: Json | null
        }
        Insert: {
          followed_at?: string | null
          follower_id?: string | null
          following_id?: string | null
          id?: string
          notification_settings?: Json | null
        }
        Update: {
          followed_at?: string | null
          follower_id?: string | null
          following_id?: string | null
          id?: string
          notification_settings?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creator_follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_forums: {
        Row: {
          category: string
          created_at: string | null
          creator_id: string | null
          description: string | null
          id: string
          is_locked: boolean | null
          is_pinned: boolean | null
          last_activity: string | null
          reply_count: number | null
          skill_level: string | null
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          category: string
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          last_activity?: string | null
          reply_count?: number | null
          skill_level?: string | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          category?: string
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          last_activity?: string | null
          reply_count?: number | null
          skill_level?: string | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_forums_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_grants: {
        Row: {
          amount: number
          application_deadline: string | null
          applications_count: number | null
          available_slots: number | null
          created_at: string | null
          description: string
          grant_type: string
          id: string
          requirements: Json | null
          selection_criteria: Json | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          application_deadline?: string | null
          applications_count?: number | null
          available_slots?: number | null
          created_at?: string | null
          description: string
          grant_type: string
          id?: string
          requirements?: Json | null
          selection_criteria?: Json | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          application_deadline?: string | null
          applications_count?: number | null
          available_slots?: number | null
          created_at?: string | null
          description?: string
          grant_type?: string
          id?: string
          requirements?: Json | null
          selection_criteria?: Json | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      creator_integrations: {
        Row: {
          api_credentials: Json | null
          config: Json
          created_at: string | null
          creator_id: string | null
          error_log: string | null
          id: string
          integration_type: string
          is_active: boolean | null
          last_sync: string | null
          sync_status: string | null
          updated_at: string | null
        }
        Insert: {
          api_credentials?: Json | null
          config?: Json
          created_at?: string | null
          creator_id?: string | null
          error_log?: string | null
          id?: string
          integration_type: string
          is_active?: boolean | null
          last_sync?: string | null
          sync_status?: string | null
          updated_at?: string | null
        }
        Update: {
          api_credentials?: Json | null
          config?: Json
          created_at?: string | null
          creator_id?: string | null
          error_log?: string | null
          id?: string
          integration_type?: string
          is_active?: boolean | null
          last_sync?: string | null
          sync_status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_integrations_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_mentorships: {
        Row: {
          commission_percentage: number | null
          created_at: string | null
          feedback_rating: number | null
          id: string
          mentee_id: string | null
          mentor_id: string | null
          payment_amount: number | null
          program_type: string
          sessions_completed: number | null
          start_date: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          commission_percentage?: number | null
          created_at?: string | null
          feedback_rating?: number | null
          id?: string
          mentee_id?: string | null
          mentor_id?: string | null
          payment_amount?: number | null
          program_type: string
          sessions_completed?: number | null
          start_date?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          commission_percentage?: number | null
          created_at?: string | null
          feedback_rating?: number | null
          id?: string
          mentee_id?: string | null
          mentor_id?: string | null
          payment_amount?: number | null
          program_type?: string
          sessions_completed?: number | null
          start_date?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_mentorships_mentee_id_fkey"
            columns: ["mentee_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creator_mentorships_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_profiles: {
        Row: {
          avg_rating: number | null
          bio: string | null
          cards_created: number | null
          commission_rates: Json | null
          created_at: string | null
          id: string
          payout_enabled: boolean | null
          portfolio_url: string | null
          specialties: string[] | null
          stripe_account_id: string | null
          tax_info: Json | null
          total_earnings: number | null
          updated_at: string | null
          user_id: string | null
          verification_status: string | null
        }
        Insert: {
          avg_rating?: number | null
          bio?: string | null
          cards_created?: number | null
          commission_rates?: Json | null
          created_at?: string | null
          id?: string
          payout_enabled?: boolean | null
          portfolio_url?: string | null
          specialties?: string[] | null
          stripe_account_id?: string | null
          tax_info?: Json | null
          total_earnings?: number | null
          updated_at?: string | null
          user_id?: string | null
          verification_status?: string | null
        }
        Update: {
          avg_rating?: number | null
          bio?: string | null
          cards_created?: number | null
          commission_rates?: Json | null
          created_at?: string | null
          id?: string
          payout_enabled?: boolean | null
          portfolio_url?: string | null
          specialties?: string[] | null
          stripe_account_id?: string | null
          tax_info?: Json | null
          total_earnings?: number | null
          updated_at?: string | null
          user_id?: string | null
          verification_status?: string | null
        }
        Relationships: []
      }
      creator_progress: {
        Row: {
          cards_created_basic: number | null
          cards_created_studio: number | null
          created_at: string | null
          elements_created: number | null
          frames_created: number | null
          id: string
          preferred_mode: string | null
          studio_unlocked: boolean | null
          total_earnings_cents: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          cards_created_basic?: number | null
          cards_created_studio?: number | null
          created_at?: string | null
          elements_created?: number | null
          frames_created?: number | null
          id?: string
          preferred_mode?: string | null
          studio_unlocked?: boolean | null
          total_earnings_cents?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          cards_created_basic?: number | null
          cards_created_studio?: number | null
          created_at?: string | null
          elements_created?: number | null
          frames_created?: number | null
          id?: string
          preferred_mode?: string | null
          studio_unlocked?: boolean | null
          total_earnings_cents?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      creator_streams: {
        Row: {
          actual_start: string | null
          chat_enabled: boolean | null
          created_at: string | null
          creator_id: string | null
          current_viewers: number | null
          description: string | null
          ended_at: string | null
          id: string
          max_viewers: number | null
          recording_url: string | null
          scheduled_start: string | null
          status: string | null
          stream_type: string | null
          stream_url: string | null
          thumbnail_url: string | null
          title: string
          total_views: number | null
        }
        Insert: {
          actual_start?: string | null
          chat_enabled?: boolean | null
          created_at?: string | null
          creator_id?: string | null
          current_viewers?: number | null
          description?: string | null
          ended_at?: string | null
          id?: string
          max_viewers?: number | null
          recording_url?: string | null
          scheduled_start?: string | null
          status?: string | null
          stream_type?: string | null
          stream_url?: string | null
          thumbnail_url?: string | null
          title: string
          total_views?: number | null
        }
        Update: {
          actual_start?: string | null
          chat_enabled?: boolean | null
          created_at?: string | null
          creator_id?: string | null
          current_viewers?: number | null
          description?: string | null
          ended_at?: string | null
          id?: string
          max_viewers?: number | null
          recording_url?: string | null
          scheduled_start?: string | null
          status?: string | null
          stream_type?: string | null
          stream_url?: string | null
          thumbnail_url?: string | null
          title?: string
          total_views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_streams_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_subscription_tiers: {
        Row: {
          created_at: string | null
          description: string | null
          features: Json
          id: string
          is_active: boolean | null
          limits: Json
          monthly_price: number
          sort_order: number | null
          tier_name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          features?: Json
          id?: string
          is_active?: boolean | null
          limits?: Json
          monthly_price: number
          sort_order?: number | null
          tier_name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          features?: Json
          id?: string
          is_active?: boolean | null
          limits?: Json
          monthly_price?: number
          sort_order?: number | null
          tier_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      creator_subscriptions: {
        Row: {
          benefits: Json | null
          created_at: string | null
          creator_id: string | null
          end_date: string | null
          id: string
          monthly_fee: number
          start_date: string | null
          status: string | null
          stripe_subscription_id: string | null
          subscriber_id: string | null
          subscription_type: string
        }
        Insert: {
          benefits?: Json | null
          created_at?: string | null
          creator_id?: string | null
          end_date?: string | null
          id?: string
          monthly_fee: number
          start_date?: string | null
          status?: string | null
          stripe_subscription_id?: string | null
          subscriber_id?: string | null
          subscription_type: string
        }
        Update: {
          benefits?: Json | null
          created_at?: string | null
          creator_id?: string | null
          end_date?: string | null
          id?: string
          monthly_fee?: number
          start_date?: string | null
          status?: string | null
          stripe_subscription_id?: string | null
          subscriber_id?: string | null
          subscription_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "creator_subscriptions_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_templates: {
        Row: {
          canvas: Json
          category: string
          compatibility: string[]
          created_at: string
          creator_id: string
          description: string | null
          download_count: number
          file_size: number
          id: string
          last_updated: string
          layers: Json
          license: string
          preview_images: string[]
          price: number
          rating: number
          review_count: number
          tags: string[]
          thumbnail_url: string | null
          title: string
        }
        Insert: {
          canvas?: Json
          category: string
          compatibility?: string[]
          created_at?: string
          creator_id: string
          description?: string | null
          download_count?: number
          file_size?: number
          id?: string
          last_updated?: string
          layers?: Json
          license?: string
          preview_images?: string[]
          price?: number
          rating?: number
          review_count?: number
          tags?: string[]
          thumbnail_url?: string | null
          title: string
        }
        Update: {
          canvas?: Json
          category?: string
          compatibility?: string[]
          created_at?: string
          creator_id?: string
          description?: string | null
          download_count?: number
          file_size?: number
          id?: string
          last_updated?: string
          layers?: Json
          license?: string
          preview_images?: string[]
          price?: number
          rating?: number
          review_count?: number
          tags?: string[]
          thumbnail_url?: string | null
          title?: string
        }
        Relationships: []
      }
      creator_tokens: {
        Row: {
          created_at: string | null
          creator_id: string | null
          expires_at: string | null
          id: string
          metadata: Json | null
          source: string
          token_type: string
          token_value: number
          used_at: string | null
        }
        Insert: {
          created_at?: string | null
          creator_id?: string | null
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          source: string
          token_type: string
          token_value: number
          used_at?: string | null
        }
        Update: {
          created_at?: string | null
          creator_id?: string | null
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          source?: string
          token_type?: string
          token_value?: number
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_tokens_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_challenges: {
        Row: {
          challenge_type: string
          created_at: string | null
          description: string
          expires_at: string
          id: string
          is_active: boolean | null
          points_reward: number
          target_value: number
          title: string
        }
        Insert: {
          challenge_type: string
          created_at?: string | null
          description: string
          expires_at: string
          id?: string
          is_active?: boolean | null
          points_reward?: number
          target_value?: number
          title: string
        }
        Update: {
          challenge_type?: string
          created_at?: string | null
          description?: string
          expires_at?: string
          id?: string
          is_active?: boolean | null
          points_reward?: number
          target_value?: number
          title?: string
        }
        Relationships: []
      }
      design_assets_library: {
        Row: {
          asset_name: string
          asset_type: string
          categories: string[] | null
          created_at: string | null
          creator_id: string | null
          description: string | null
          dimensions: Json | null
          downloads_count: number | null
          file_format: string | null
          file_size: number | null
          file_url: string
          id: string
          is_featured: boolean | null
          metadata: Json | null
          price: number | null
          revenue_generated: number | null
          tags: string[] | null
          thumbnail_url: string | null
          updated_at: string | null
          usage_rights: string | null
        }
        Insert: {
          asset_name: string
          asset_type: string
          categories?: string[] | null
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          dimensions?: Json | null
          downloads_count?: number | null
          file_format?: string | null
          file_size?: number | null
          file_url: string
          id?: string
          is_featured?: boolean | null
          metadata?: Json | null
          price?: number | null
          revenue_generated?: number | null
          tags?: string[] | null
          thumbnail_url?: string | null
          updated_at?: string | null
          usage_rights?: string | null
        }
        Update: {
          asset_name?: string
          asset_type?: string
          categories?: string[] | null
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          dimensions?: Json | null
          downloads_count?: number | null
          file_format?: string | null
          file_size?: number | null
          file_url?: string
          id?: string
          is_featured?: boolean | null
          metadata?: Json | null
          price?: number | null
          revenue_generated?: number | null
          tags?: string[] | null
          thumbnail_url?: string | null
          updated_at?: string | null
          usage_rights?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "design_assets_library_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      design_projects: {
        Row: {
          canvas: Json
          collaborators: Json
          created_at: string
          creator_id: string
          description: string | null
          id: string
          last_modified: string
          layers: Json
          metadata: Json
          status: string
          template_id: string | null
          title: string
          version: number
        }
        Insert: {
          canvas?: Json
          collaborators?: Json
          created_at?: string
          creator_id: string
          description?: string | null
          id?: string
          last_modified?: string
          layers?: Json
          metadata?: Json
          status?: string
          template_id?: string | null
          title: string
          version?: number
        }
        Update: {
          canvas?: Json
          collaborators?: Json
          created_at?: string
          creator_id?: string
          description?: string | null
          id?: string
          last_modified?: string
          layers?: Json
          metadata?: Json
          status?: string
          template_id?: string | null
          title?: string
          version?: number
        }
        Relationships: []
      }
      element_downloads: {
        Row: {
          amount_paid_cents: number | null
          download_type: string
          downloaded_at: string | null
          element_id: string | null
          frame_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          amount_paid_cents?: number | null
          download_type: string
          downloaded_at?: string | null
          element_id?: string | null
          frame_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          amount_paid_cents?: number | null
          download_type?: string
          downloaded_at?: string | null
          element_id?: string | null
          frame_id?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "element_downloads_element_id_fkey"
            columns: ["element_id"]
            isOneToOne: false
            referencedRelation: "crd_elements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "element_downloads_frame_id_fkey"
            columns: ["frame_id"]
            isOneToOne: false
            referencedRelation: "crd_frames"
            referencedColumns: ["id"]
          },
        ]
      }
      enterprise_organizations: {
        Row: {
          billing_contact_id: string | null
          created_at: string | null
          custom_domain: string | null
          domain: string | null
          id: string
          name: string
          ssl_certificate_status: string | null
          subscription_tier: string | null
          updated_at: string | null
          white_label_config: Json | null
        }
        Insert: {
          billing_contact_id?: string | null
          created_at?: string | null
          custom_domain?: string | null
          domain?: string | null
          id?: string
          name: string
          ssl_certificate_status?: string | null
          subscription_tier?: string | null
          updated_at?: string | null
          white_label_config?: Json | null
        }
        Update: {
          billing_contact_id?: string | null
          created_at?: string | null
          custom_domain?: string | null
          domain?: string | null
          id?: string
          name?: string
          ssl_certificate_status?: string | null
          subscription_tier?: string | null
          updated_at?: string | null
          white_label_config?: Json | null
        }
        Relationships: []
      }
      enterprise_users: {
        Row: {
          added_at: string | null
          id: string
          organization_id: string | null
          permissions: Json | null
          role: string | null
          user_id: string | null
        }
        Insert: {
          added_at?: string | null
          id?: string
          organization_id?: string | null
          permissions?: Json | null
          role?: string | null
          user_id?: string | null
        }
        Update: {
          added_at?: string | null
          id?: string
          organization_id?: string | null
          permissions?: Json | null
          role?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enterprise_users_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "enterprise_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_analytics: {
        Row: {
          avg_transaction_value: number | null
          created_at: string | null
          id: string
          total_fees: number | null
          total_payouts: number | null
          total_revenue: number | null
          transaction_count: number | null
          transaction_date: string
        }
        Insert: {
          avg_transaction_value?: number | null
          created_at?: string | null
          id?: string
          total_fees?: number | null
          total_payouts?: number | null
          total_revenue?: number | null
          transaction_count?: number | null
          transaction_date: string
        }
        Update: {
          avg_transaction_value?: number | null
          created_at?: string | null
          id?: string
          total_fees?: number | null
          total_payouts?: number | null
          total_revenue?: number | null
          transaction_count?: number | null
          transaction_date?: string
        }
        Relationships: []
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
      forum_replies: {
        Row: {
          content: string
          created_at: string | null
          creator_id: string | null
          forum_id: string | null
          id: string
          is_solution: boolean | null
          parent_reply_id: string | null
          updated_at: string | null
          upvotes: number | null
        }
        Insert: {
          content: string
          created_at?: string | null
          creator_id?: string | null
          forum_id?: string | null
          id?: string
          is_solution?: boolean | null
          parent_reply_id?: string | null
          updated_at?: string | null
          upvotes?: number | null
        }
        Update: {
          content?: string
          created_at?: string | null
          creator_id?: string | null
          forum_id?: string | null
          id?: string
          is_solution?: boolean | null
          parent_reply_id?: string | null
          updated_at?: string | null
          upvotes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_replies_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_replies_forum_id_fkey"
            columns: ["forum_id"]
            isOneToOne: false
            referencedRelation: "creator_forums"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_replies_parent_reply_id_fkey"
            columns: ["parent_reply_id"]
            isOneToOne: false
            referencedRelation: "forum_replies"
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
      gdpr_requests: {
        Row: {
          created_at: string | null
          data_package_url: string | null
          expires_at: string | null
          id: string
          processed_at: string | null
          request_type: string
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          data_package_url?: string | null
          expires_at?: string | null
          id?: string
          processed_at?: string | null
          request_type: string
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          data_package_url?: string | null
          expires_at?: string | null
          id?: string
          processed_at?: string | null
          request_type?: string
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      grant_applications: {
        Row: {
          approved_amount: number | null
          budget_breakdown: Json
          creator_id: string | null
          feedback: string | null
          grant_id: string | null
          id: string
          portfolio_links: string[] | null
          project_proposal: string
          reviewed_at: string | null
          score: number | null
          status: string | null
          submitted_at: string | null
          timeline: Json
        }
        Insert: {
          approved_amount?: number | null
          budget_breakdown: Json
          creator_id?: string | null
          feedback?: string | null
          grant_id?: string | null
          id?: string
          portfolio_links?: string[] | null
          project_proposal: string
          reviewed_at?: string | null
          score?: number | null
          status?: string | null
          submitted_at?: string | null
          timeline: Json
        }
        Update: {
          approved_amount?: number | null
          budget_breakdown?: Json
          creator_id?: string | null
          feedback?: string | null
          grant_id?: string | null
          id?: string
          portfolio_links?: string[] | null
          project_proposal?: string
          reviewed_at?: string | null
          score?: number | null
          status?: string | null
          submitted_at?: string | null
          timeline?: Json
        }
        Relationships: [
          {
            foreignKeyName: "grant_applications_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grant_applications_grant_id_fkey"
            columns: ["grant_id"]
            isOneToOne: false
            referencedRelation: "creator_grants"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_base: {
        Row: {
          author_id: string | null
          category: string
          content: string
          created_at: string | null
          helpful_count: number | null
          id: string
          search_vector: unknown | null
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          author_id?: string | null
          category: string
          content: string
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          search_vector?: unknown | null
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          author_id?: string | null
          category?: string
          content?: string
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          search_vector?: unknown | null
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: []
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
      marketplace_seo: {
        Row: {
          auto_optimization_enabled: boolean | null
          created_at: string | null
          id: string
          keywords: string[] | null
          last_optimized: string | null
          listing_id: string | null
          meta_description: string | null
          meta_title: string | null
          og_image_url: string | null
          seo_score: number | null
          structured_data: Json | null
          updated_at: string | null
        }
        Insert: {
          auto_optimization_enabled?: boolean | null
          created_at?: string | null
          id?: string
          keywords?: string[] | null
          last_optimized?: string | null
          listing_id?: string | null
          meta_description?: string | null
          meta_title?: string | null
          og_image_url?: string | null
          seo_score?: number | null
          structured_data?: Json | null
          updated_at?: string | null
        }
        Update: {
          auto_optimization_enabled?: boolean | null
          created_at?: string | null
          id?: string
          keywords?: string[] | null
          last_optimized?: string | null
          listing_id?: string | null
          meta_description?: string | null
          meta_title?: string | null
          og_image_url?: string | null
          seo_score?: number | null
          structured_data?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_seo_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
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
      moderation_queue: {
        Row: {
          assigned_moderator_id: string | null
          content_id: string
          content_type: string
          created_at: string | null
          id: string
          priority: number | null
          reason: string
          reporter_id: string | null
          resolution_notes: string | null
          resolved_at: string | null
          status: string | null
        }
        Insert: {
          assigned_moderator_id?: string | null
          content_id: string
          content_type: string
          created_at?: string | null
          id?: string
          priority?: number | null
          reason: string
          reporter_id?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: string | null
        }
        Update: {
          assigned_moderator_id?: string | null
          content_id?: string
          content_type?: string
          created_at?: string | null
          id?: string
          priority?: number | null
          reason?: string
          reporter_id?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: string | null
        }
        Relationships: []
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
          metadata: Json | null
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
          metadata?: Json | null
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
          metadata?: Json | null
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
      performance_metrics: {
        Row: {
          creator_id: string | null
          id: string
          measurement_context: string | null
          metadata: Json | null
          metric_name: string
          metric_unit: string | null
          metric_value: number
          timestamp: string | null
        }
        Insert: {
          creator_id?: string | null
          id?: string
          measurement_context?: string | null
          metadata?: Json | null
          metric_name: string
          metric_unit?: string | null
          metric_value: number
          timestamp?: string | null
        }
        Update: {
          creator_id?: string | null
          id?: string
          measurement_context?: string | null
          metadata?: Json | null
          metric_name?: string
          metric_unit?: string | null
          metric_value?: number
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "performance_metrics_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_analytics: {
        Row: {
          created_at: string | null
          date: string
          id: string
          metadata: Json | null
          metric_type: string
          metric_value: number
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          metadata?: Json | null
          metric_type: string
          metric_value: number
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          metadata?: Json | null
          metric_type?: string
          metric_value?: number
        }
        Relationships: []
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
      project_collaborators: {
        Row: {
          id: string
          invited_at: string
          joined_at: string | null
          permissions: string[]
          project_id: string
          role: string
          user_id: string
          username: string
        }
        Insert: {
          id?: string
          invited_at?: string
          joined_at?: string | null
          permissions?: string[]
          project_id: string
          role?: string
          user_id: string
          username: string
        }
        Update: {
          id?: string
          invited_at?: string
          joined_at?: string | null
          permissions?: string[]
          project_id?: string
          role?: string
          user_id?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_collaborators_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "design_projects"
            referencedColumns: ["id"]
          },
        ]
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
      social_activities: {
        Row: {
          activity_timestamp: string | null
          activity_type: string
          created_at: string | null
          featured_status: boolean | null
          id: string
          metadata: Json | null
          reaction_count: number | null
          target_id: string | null
          target_type: string | null
          updated_at: string | null
          user_id: string
          visibility: string | null
        }
        Insert: {
          activity_timestamp?: string | null
          activity_type: string
          created_at?: string | null
          featured_status?: boolean | null
          id?: string
          metadata?: Json | null
          reaction_count?: number | null
          target_id?: string | null
          target_type?: string | null
          updated_at?: string | null
          user_id: string
          visibility?: string | null
        }
        Update: {
          activity_timestamp?: string | null
          activity_type?: string
          created_at?: string | null
          featured_status?: boolean | null
          id?: string
          metadata?: Json | null
          reaction_count?: number | null
          target_id?: string | null
          target_type?: string | null
          updated_at?: string | null
          user_id?: string
          visibility?: string | null
        }
        Relationships: []
      }
      stream_interactions: {
        Row: {
          id: string
          interaction_type: string
          message: string | null
          stream_id: string | null
          timestamp: string | null
          viewer_id: string | null
        }
        Insert: {
          id?: string
          interaction_type: string
          message?: string | null
          stream_id?: string | null
          timestamp?: string | null
          viewer_id?: string | null
        }
        Update: {
          id?: string
          interaction_type?: string
          message?: string | null
          stream_id?: string | null
          timestamp?: string | null
          viewer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stream_interactions_stream_id_fkey"
            columns: ["stream_id"]
            isOneToOne: false
            referencedRelation: "creator_streams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stream_interactions_viewer_id_fkey"
            columns: ["viewer_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      support_messages: {
        Row: {
          attachments: Json | null
          created_at: string | null
          id: string
          is_internal: boolean | null
          message: string
          sender_id: string | null
          ticket_id: string | null
        }
        Insert: {
          attachments?: Json | null
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          message: string
          sender_id?: string | null
          ticket_id?: string | null
        }
        Update: {
          attachments?: Json | null
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          message?: string
          sender_id?: string | null
          ticket_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      support_ticket_messages: {
        Row: {
          attachments: Json | null
          created_at: string | null
          id: string
          is_internal: boolean | null
          message: string
          ticket_id: string | null
          user_id: string | null
        }
        Insert: {
          attachments?: Json | null
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          message: string
          ticket_id?: string | null
          user_id?: string | null
        }
        Update: {
          attachments?: Json | null
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          message?: string
          ticket_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_ticket_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          assigned_agent_id: string | null
          category: string
          created_at: string | null
          description: string
          id: string
          metadata: Json | null
          priority: string | null
          status: string | null
          subject: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          assigned_agent_id?: string | null
          category: string
          created_at?: string | null
          description: string
          id?: string
          metadata?: Json | null
          priority?: string | null
          status?: string | null
          subject: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          assigned_agent_id?: string | null
          category?: string
          created_at?: string | null
          description?: string
          id?: string
          metadata?: Json | null
          priority?: string | null
          status?: string | null
          subject?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      system_health: {
        Row: {
          id: string
          metadata: Json | null
          metric_name: string
          metric_value: number
          recorded_at: string | null
          status: string | null
          threshold_critical: number | null
          threshold_warning: number | null
        }
        Insert: {
          id?: string
          metadata?: Json | null
          metric_name: string
          metric_value: number
          recorded_at?: string | null
          status?: string | null
          threshold_critical?: number | null
          threshold_warning?: number | null
        }
        Update: {
          id?: string
          metadata?: Json | null
          metric_name?: string
          metric_value?: number
          recorded_at?: string | null
          status?: string | null
          threshold_critical?: number | null
          threshold_warning?: number | null
        }
        Relationships: []
      }
      system_metrics: {
        Row: {
          id: string
          metric_name: string
          metric_type: string | null
          metric_value: number
          recorded_at: string | null
          tags: Json | null
        }
        Insert: {
          id?: string
          metric_name: string
          metric_type?: string | null
          metric_value: number
          recorded_at?: string | null
          tags?: Json | null
        }
        Update: {
          id?: string
          metric_name?: string
          metric_type?: string | null
          metric_value?: number
          recorded_at?: string | null
          tags?: Json | null
        }
        Relationships: []
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
      user_achievements: {
        Row: {
          achievement_name: string
          achievement_type: string
          badge_image_url: string | null
          description: string | null
          id: string
          is_featured: boolean | null
          metadata: Json | null
          points_awarded: number | null
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          achievement_name: string
          achievement_type: string
          badge_image_url?: string | null
          description?: string | null
          id?: string
          is_featured?: boolean | null
          metadata?: Json | null
          points_awarded?: number | null
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          achievement_name?: string
          achievement_type?: string
          badge_image_url?: string | null
          description?: string | null
          id?: string
          is_featured?: boolean | null
          metadata?: Json | null
          points_awarded?: number | null
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_analytics: {
        Row: {
          cards_created: number | null
          cards_viewed: number | null
          created_at: string | null
          id: string
          last_activity: string | null
          login_count: number | null
          metric_date: string
          session_duration_minutes: number | null
          total_earned: number | null
          total_spent: number | null
          transactions_count: number | null
          user_id: string | null
        }
        Insert: {
          cards_created?: number | null
          cards_viewed?: number | null
          created_at?: string | null
          id?: string
          last_activity?: string | null
          login_count?: number | null
          metric_date: string
          session_duration_minutes?: number | null
          total_earned?: number | null
          total_spent?: number | null
          transactions_count?: number | null
          user_id?: string | null
        }
        Update: {
          cards_created?: number | null
          cards_viewed?: number | null
          created_at?: string | null
          id?: string
          last_activity?: string | null
          login_count?: number | null
          metric_date?: string
          session_duration_minutes?: number | null
          total_earned?: number | null
          total_spent?: number | null
          transactions_count?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_card_ownership: {
        Row: {
          acquisition_date: string | null
          acquisition_method: string | null
          acquisition_price: number | null
          card_id: string
          id: string
          is_favorite: boolean | null
          quantity: number | null
          user_id: string
        }
        Insert: {
          acquisition_date?: string | null
          acquisition_method?: string | null
          acquisition_price?: number | null
          card_id: string
          id?: string
          is_favorite?: boolean | null
          quantity?: number | null
          user_id: string
        }
        Update: {
          acquisition_date?: string | null
          acquisition_method?: string | null
          acquisition_price?: number | null
          card_id?: string
          id?: string
          is_favorite?: boolean | null
          quantity?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_card_ownership_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_card_ownership_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_challenge_progress: {
        Row: {
          challenge_id: string
          completed_at: string | null
          created_at: string | null
          current_progress: number | null
          id: string
          is_completed: boolean | null
          user_id: string
        }
        Insert: {
          challenge_id: string
          completed_at?: string | null
          created_at?: string | null
          current_progress?: number | null
          id?: string
          is_completed?: boolean | null
          user_id: string
        }
        Update: {
          challenge_id?: string
          completed_at?: string | null
          created_at?: string | null
          current_progress?: number | null
          id?: string
          is_completed?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_challenge_progress_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "daily_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_experience_points: {
        Row: {
          created_at: string | null
          id: string
          metadata: Json | null
          points_earned: number
          points_source: string
          source_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          points_earned?: number
          points_source: string
          source_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          points_earned?: number
          points_source?: string
          source_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          accessibility_options: Json | null
          created_at: string | null
          id: string
          notifications_enabled: Json | null
          privacy_settings: Json | null
          quality_settings: Json | null
          theme: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          accessibility_options?: Json | null
          created_at?: string | null
          id?: string
          notifications_enabled?: Json | null
          privacy_settings?: Json | null
          quality_settings?: Json | null
          theme?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          accessibility_options?: Json | null
          created_at?: string | null
          id?: string
          notifications_enabled?: Json | null
          privacy_settings?: Json | null
          quality_settings?: Json | null
          theme?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          cover_image_url: string | null
          created_at: string | null
          email: string
          experience_points: number | null
          full_name: string | null
          id: string
          is_creator: boolean | null
          is_verified: boolean | null
          level: number | null
          location: string | null
          privacy_settings: Json | null
          social_links: Json | null
          subscription_tier: string | null
          total_followers: number | null
          total_following: number | null
          updated_at: string | null
          username: string
          verification_status: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          email: string
          experience_points?: number | null
          full_name?: string | null
          id: string
          is_creator?: boolean | null
          is_verified?: boolean | null
          level?: number | null
          location?: string | null
          privacy_settings?: Json | null
          social_links?: Json | null
          subscription_tier?: string | null
          total_followers?: number | null
          total_following?: number | null
          updated_at?: string | null
          username: string
          verification_status?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          email?: string
          experience_points?: number | null
          full_name?: string | null
          id?: string
          is_creator?: boolean | null
          is_verified?: boolean | null
          level?: number | null
          location?: string | null
          privacy_settings?: Json | null
          social_links?: Json | null
          subscription_tier?: string | null
          total_followers?: number | null
          total_following?: number | null
          updated_at?: string | null
          username?: string
          verification_status?: string | null
          website?: string | null
        }
        Relationships: []
      }
      user_relationships: {
        Row: {
          created_at: string | null
          follower_id: string
          following_id: string
          id: string
          interaction_count: number | null
          last_interaction: string | null
          notification_settings: Json | null
          relationship_type: string | null
        }
        Insert: {
          created_at?: string | null
          follower_id: string
          following_id: string
          id?: string
          interaction_count?: number | null
          last_interaction?: string | null
          notification_settings?: Json | null
          relationship_type?: string | null
        }
        Update: {
          created_at?: string | null
          follower_id?: string
          following_id?: string
          id?: string
          interaction_count?: number | null
          last_interaction?: string | null
          notification_settings?: Json | null
          relationship_type?: string | null
        }
        Relationships: []
      }
      user_stats: {
        Row: {
          cards_created: number | null
          cards_owned: number | null
          created_at: string | null
          id: string
          last_active: string | null
          reputation_score: number | null
          total_earned: number | null
          total_spent: number | null
          trades_completed: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cards_created?: number | null
          cards_owned?: number | null
          created_at?: string | null
          id?: string
          last_active?: string | null
          reputation_score?: number | null
          total_earned?: number | null
          total_spent?: number | null
          trades_completed?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cards_created?: number | null
          cards_owned?: number | null
          created_at?: string | null
          id?: string
          last_active?: string | null
          reputation_score?: number | null
          total_earned?: number | null
          total_spent?: number | null
          trades_completed?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
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
      award_user_xp: {
        Args: {
          user_uuid: string
          points: number
          source: string
          source_ref_id?: string
          xp_metadata?: Json
        }
        Returns: Json
      }
      calculate_creator_earnings: {
        Args: { creator_uuid: string; start_date?: string; end_date?: string }
        Returns: {
          total_earnings: number
          pending_earnings: number
          paid_earnings: number
          transaction_count: number
        }[]
      }
      calculate_creator_performance_score: {
        Args: { creator_uuid: string }
        Returns: number
      }
      calculate_platform_fee: {
        Args: { amount: number }
        Returns: number
      }
      calculate_user_level: {
        Args: { total_xp: number }
        Returns: Json
      }
      create_collection_from_template: {
        Args: { template_id: string; collection_title: string; user_id: string }
        Returns: string
      }
      expire_old_trades: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      generate_daily_challenges: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      generate_group_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_activity_feed: {
        Args: { user_uuid: string; limit_count?: number }
        Returns: {
          activity_id: string
          user_id: string
          username: string
          avatar_url: string
          activity_type: string
          target_id: string
          target_type: string
          activity_timestamp: string
          metadata: Json
          reaction_count: number
        }[]
      }
      get_collection_card_count: {
        Args: { collection_uuid: string }
        Returns: number
      }
      get_collection_follower_count: {
        Args: { collection_uuid: string }
        Returns: number
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
      get_creator_activity_feed: {
        Args: { creator_uuid: string; limit_count?: number }
        Returns: {
          activity_id: string
          creator_id: string
          creator_username: string
          activity_type: string
          activity_data: Json
          created_at: string
        }[]
      }
      get_platform_metrics: {
        Args: { days_back?: number }
        Returns: {
          metric_type: string
          current_value: number
          previous_value: number
          change_percentage: number
        }[]
      }
      get_trending_creators: {
        Args: { days_back?: number }
        Returns: {
          creator_id: string
          username: string
          activity_count: number
          follower_count: number
        }[]
      }
      get_user_stats: {
        Args: { user_uuid: string }
        Returns: {
          total_cards: number
          total_collections: number
          total_followers: number
          total_following: number
          experience_points: number
          level: number
          achievements_count: number
        }[]
      }
      has_admin_permission: {
        Args: { permission_name: string }
        Returns: boolean
      }
      increment_article_views: {
        Args: { article_id: string }
        Returns: undefined
      }
      increment_listing_views: {
        Args: { listing_uuid: string }
        Returns: undefined
      }
      is_admin: {
        Args: { user_uuid?: string }
        Returns: boolean
      }
      log_audit_event: {
        Args: {
          p_action: string
          p_resource_type: string
          p_resource_id?: string
          p_old_values?: Json
          p_new_values?: Json
        }
        Returns: string
      }
      optimize_listing_pricing: {
        Args: { listing_uuid: string }
        Returns: number
      }
      place_bid: {
        Args: { p_auction_id: string; p_amount: number; p_proxy_max?: number }
        Returns: string
      }
      process_creator_payouts: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      process_gdpr_export: {
        Args: { user_uuid: string }
        Returns: Json
      }
      unlock_achievement: {
        Args: {
          user_uuid: string
          achievement_type_param: string
          achievement_name_param: string
          description_param: string
          points_param: number
          metadata_param?: Json
        }
        Returns: boolean
      }
      update_market_analytics: {
        Args: { p_card_id: string; p_sale_price: number }
        Returns: undefined
      }
      update_seo_optimization: {
        Args: { listing_uuid: string }
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
