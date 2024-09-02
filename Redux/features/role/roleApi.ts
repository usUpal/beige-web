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
        console.log("🚀 ~ data:", data)
        return {
          url: 'roles',
          method: 'POST',
          body: data,
        }
      }
    }),

    updateRole: builder.mutation({
      query: (data) => {
        console.log("🚀 ~ data:", data)
        return {
          url: `roles?id=${data?.id}`,
          method: 'PUT',
          body: data?.formData,
        }
      }
    }),
  })
})

export const { useGetAllRolesQuery, useGetAllPermissionsQuery, useGetSingleRoleQuery,usePostRoleMutation,useUpdateRoleMutation } = roleApi
































