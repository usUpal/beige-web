import { baseApi } from "@/Redux/api/baseApi";

const roleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPermissions:builder.query({
      query:()=>{
        return {
          url:"",
          method:'GET'
        }
      }
    }),

    postRole:builder.mutation({
      query:(data) => ({
        url:'add-role',
        method:'POST',
        body:data,
      })
    }),

  })
})

































