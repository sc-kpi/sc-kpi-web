"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  assignPartnerLevel,
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  removePartnerLevel,
  updateUser,
  updateUserStatus,
  updateUserTier,
} from "../api";
import type { AssignPartnerLevelRequest, CreateUserRequest, UpdateUserRequest } from "../types";

const USERS_KEY = ["users"] as const;
const userKey = (id: string) => ["users", id] as const;

export function useUsers(page = 0, size = 20) {
  return useQuery({
    queryKey: [...USERS_KEY, { page, size }],
    queryFn: () => getUsers(page, size),
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: userKey(id),
    queryFn: () => getUserById(id),
    enabled: !!id,
  });
}

export function useCreateUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUserRequest) => createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_KEY });
    },
  });
}

export function useUpdateUserMutation(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateUserRequest) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKey(id) });
      queryClient.invalidateQueries({ queryKey: USERS_KEY });
    },
  });
}

export function useUpdateTierMutation(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tier: number) => updateUserTier(id, tier),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKey(id) });
      queryClient.invalidateQueries({ queryKey: USERS_KEY });
    },
  });
}

export function useUpdateStatusMutation(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (active: boolean) => updateUserStatus(id, active),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKey(id) });
      queryClient.invalidateQueries({ queryKey: USERS_KEY });
    },
  });
}

export function useDeleteUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_KEY });
    },
  });
}

export function useAssignPartnerMutation(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AssignPartnerLevelRequest) => assignPartnerLevel(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKey(id) });
    },
  });
}

export function useRemovePartnerMutation(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (partnerId: string) => removePartnerLevel(id, partnerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKey(id) });
    },
  });
}
