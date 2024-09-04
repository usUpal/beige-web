import { baseApi } from "@/Redux/api/baseApi";

const roleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllRoles: builder.query({
      query: () => {
        return {
          url: "roles",
          method: 'GET'
        }
      }
    }),

    getAllPermissions: builder.query({
      query: () => {
        return {
          url: "permissions",
          method: 'GET'
        }
      }
    }),

    getErrorStatus: builder.query({
      query: () => {
        return {
          url: "error",
          method: 'GET'
        }
      }
    }),

    getSingleRole: builder.query({
      query:(data) => {
        return {
          url: `roles?id=${data}`,
          method: 'GET'
        }
      }
    }),

    postRole: builder.mutation({
      query: (data) => {
        return {
          url: 'roles',
          method: 'POST',
          body: data,
        }
      }
    }),

    updateRole: builder.mutation({
      query: (data) => {
        return {
          url: `roles?id=${data?.id}`,
          method: 'PUT',
          body: data?.formData,
        }
      }
    }),
    deleteRole: builder.mutation({
      query: (data) => {
        return {
          url: `roles?id=${data}`,
          method: 'DELETE',
        }
      }
    }),
  })
})

export const { useGetAllRolesQuery, useGetAllPermissionsQuery, useGetSingleRoleQuery,usePostRoleMutation,useUpdateRoleMutation,useDeleteRoleMutation , useGetErrorStatusQuery} = roleApi
































