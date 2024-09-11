import { baseApi } from "@/Redux/api/baseApi";
import { url } from "inspector";

const addonsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllAddons: builder.query({
      query: (data) => {
        return {
          url: `addOns`,
          method: 'GET',
        };
      }
    }),
    getDisputesDetails: builder.query({
      query: (data) => {
        return {
          url: `disputes/${data}`,
          method: "GET"
        }
      }
    }),
    getAddonsDetails:builder.query({
      query:(data) => {
        return {
          url : `addons/${data}`,
          method:'GET'
        }
      }
    }),
    updateAddon : builder.mutation({
      query:(data)=> {
        console.log("🚀 ~ data:", data)
        return {
          url:`addons/${data?.id}`,
          method:"PATCH",
          data:JSON.stringify(data?.formData)
        }
      }
    })
  }),
});

export const { useGetAllAddonsQuery, useLazyGetDisputesDetailsQuery , useLazyGetAddonsDetailsQuery,useUpdateAddonMutation} = addonsApi;
