import { baseApi } from "@/Redux/api/baseApi";

const profileUpdate = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateUserInfo: builder.mutation({
      query: (userData) => ({
        url: `users/${userData.id}`,
        method: 'PATCH',
        body: JSON.stringify(userData?.data),
      }),
    }),
    updateCpDataForLocation: builder.mutation({
      query: (userData) => ({
        url: `cp/${userData.id}`,
        method: 'PATCH',
        body: JSON.stringify(userData?.data),
      }),
    }),
    getCpReview : builder.query({
      query: (data) => {
        return {
          url : `review?cp_id=${data}&populate=client_id`,
          method:'GET'
        }
      }
    }),
    getCpUploadedImage : builder.query({
      query:(data) => {
        console.log("🚀 ~ data:", data)
        return {
          url : `/gcp/get-content/${data}/images`,
          method:'GET',
        }
      }
    }),
    getCpUploadedVideo : builder.query({
      query:(data) => {
        console.log("🚀 ~ data:", data)
        return {
          url :`/gcp/get-content/${data}/videos`,
          method:'GET',
        }
      }
    })
  }),
});

export const { useUpdateUserInfoMutation, useUpdateCpDataForLocationMutation ,useGetCpReviewQuery,useGetCpUploadedImageQuery,useGetCpUploadedVideoQuery} = profileUpdate;
