import { useQuery, useMutation } from "@tanstack/react-query";
import { Team, InsertTeam, InsertTeamMember, User } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { TeamMemberWithUser } from "@/lib/types";

export function useUsers() {
  return useQuery<User[]>({
    queryKey: ["/api/users"],
  });
}

export function useTeams() {
  return useQuery<Team[]>({
    queryKey: ["/api/teams"],
  });
}

export function useTeam(id: number) {
  return useQuery<Team>({
    queryKey: ["/api/teams", id],
    enabled: Boolean(id),
  });
}

export function useTeamMembers(teamId: number) {
  return useQuery<TeamMemberWithUser[]>({
    queryKey: ["/api/teams", teamId, "members"],
    enabled: Boolean(teamId),
  });
}

export function useCreateTeam() {
  return useMutation({
    mutationFn: (team: InsertTeam) => {
      return apiRequest("POST", "/api/teams", team);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
    },
  });
}

export function useAddTeamMember() {
  return useMutation({
    mutationFn: ({ teamId, member }: { teamId: number; member: Omit<InsertTeamMember, "teamId"> }) => {
      return apiRequest("POST", `/api/teams/${teamId}/members`, member);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/teams", variables.teamId, "members"] });
    },
  });
}
