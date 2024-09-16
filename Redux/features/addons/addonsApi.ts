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
    getAddonsDetails: builder.query({
      query: (data) => {
        return {
          url: `addOns/${data}`,
          method: 'GET'
        }
      }
    }),
    updateAddon: builder.mutation({
      query: (data) => {
        return {
          url: `addOns/${data?.id}`,
          method: "PATCH",
          body: data?.formData
        }
      }
    }),
    addNewAddOn: builder.mutation({
      query: (data) => {
        return {
          url: `addOns`,
          method: "POST",
          body: JSON.stringify(data)
        }
      }
    }),
  }),
});

export const { useGetAllAddonsQuery, useLazyGetDisputesDetailsQuery, useLazyGetAddonsDetailsQuery, useUpdateAddonMutation, useAddNewAddOnMutation } = addonsApi;
