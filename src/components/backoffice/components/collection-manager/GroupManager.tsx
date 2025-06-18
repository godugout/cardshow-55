
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Users, Crown, Shield, User, Trash2, UserPlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Collection {
  id: string;
  title: string;
  description?: string;
  group_code?: string;
  allow_member_card_sharing: boolean;
  created_at: string;
  memberships?: CollectionMembership[];
}

interface CollectionMembership {
  id: string;
  user_id: string;
  role: string;
  can_view_member_cards: boolean;
  joined_at: string;
  profiles?: {
    username: string;
    full_name?: string;
  };
}

export const GroupManager = () => {
  const [groups, setGroups] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('');

  const fetchGroups = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('collections')
        .select(`
          *,
          collection_memberships (
            id,
            user_id,
            role,
            can_view_member_cards,
            joined_at,
            profiles (
              username,
              full_name
            )
          )
        `)
        .eq('is_group', true)
        .order('created_at', { ascending: false });

      if (searchTerm.trim()) {
        query = query.or(`title.ilike.%${searchTerm}%,group_code.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setGroups(data || []);
    } catch (error) {
      console.error('Error fetching groups:', error);
      toast.error('Failed to fetch groups');
    } finally {
      setLoading(false);
    }
  };

  const updateMemberRole = async (membershipId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('collection_memberships')
        .update({ role: newRole })
        .eq('id', membershipId);

      if (error) throw error;

      await fetchGroups();
      toast.success('Member role updated');
    } catch (error) {
      console.error('Error updating member role:', error);
      toast.error('Failed to update member role');
    }
  };

  const removeMember = async (membershipId: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return;

    try {
      const { error } = await supabase
        .from('collection_memberships')
        .delete()
        .eq('id', membershipId);

      if (error) throw error;

      await fetchGroups();
      toast.success('Member removed');
    } catch (error) {
      console.error('Error removing member:', error);
      toast.error('Failed to remove member');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'admin':
        return <Shield className="w-4 h-4 text-blue-500" />;
      default:
        return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-yellow-500 text-black';
      case 'admin':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search groups by name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-crd-mediumGray border-crd-lightGray text-crd-white"
          />
        </div>
        <Button onClick={fetchGroups} disabled={loading} className="bg-crd-green hover:bg-crd-green/90 text-black">
          <Search className="w-4 h-4 mr-2" />
          {loading ? 'Loading...' : 'Search'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {groups.map((group) => (
          <Card key={group.id} className="bg-crd-mediumGray border-crd-lightGray">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-crd-white text-lg">{group.title}</CardTitle>
                  {group.description && (
                    <p className="text-crd-lightGray text-sm mt-1">{group.description}</p>
                  )}
                </div>
                <Badge className="bg-crd-green text-black">
                  <Users className="w-3 h-3 mr-1" />
                  {group.memberships?.length || 0}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-crd-lightGray">Group Code:</Label>
                <Badge variant="outline" className="text-crd-white font-mono">
                  {group.group_code}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-crd-lightGray">Card Sharing:</Label>
                <Badge className={group.allow_member_card_sharing ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}>
                  {group.allow_member_card_sharing ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>

              {group.memberships && group.memberships.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-crd-lightGray">Members:</Label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {group.memberships.map((membership) => (
                      <div key={membership.id} className="flex items-center justify-between bg-crd-dark p-2 rounded">
                        <div className="flex items-center gap-2">
                          {getRoleIcon(membership.role)}
                          <span className="text-crd-white text-sm">
                            {membership.profiles?.full_name || membership.profiles?.username || 'Unknown User'}
                          </span>
                          <Badge className={`text-xs ${getRoleBadgeColor(membership.role)}`}>
                            {membership.role}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          {membership.role !== 'owner' && (
                            <>
                              <Select
                                value={membership.role}
                                onValueChange={(newRole) => updateMemberRole(membership.id, newRole)}
                              >
                                <SelectTrigger className="w-20 h-6 text-xs bg-crd-mediumGray">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="member">Member</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => removeMember(membership.id)}
                                className="h-6 w-6 p-0"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {groups.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-crd-lightGray">No groups found</p>
        </div>
      )}
    </div>
  );
};
