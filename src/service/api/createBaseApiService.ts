import service from '@/service/index'

export const CreateBaseApiService = (resource: string) => {  
  return {
    // Get a list of resources
    list: () => service({ requiresAuth: true }).get(`${resource}`),
    // query: (query: string) => service({ requiresAuth: true }).get(`${resource}?${query}`),
    // Get a single resource by its id
    get: (id: string) => service({ requiresAuth: true }).get(`${resource}/${id}`),
    // Create a new resource
    create: (payload: any) => service({ requiresAuth: true }).post(`${resource}`, { data: payload }),
    // Replace an existing resource with payload
    update: (id: string, payload: any) =>
      service({ requiresAuth: true }).put(`${resource}/${id}`, { data: payload }),
    // Merge new payload into a resource
    patch: (id: string, payload: any) =>
      service({ requiresAuth: true }).patch(`${resource}/${id}`, { data: payload }),
    // Remove a resource by its id
    remove: (id: string) => service({ requiresAuth: true }).delete(`${resource}/${id}`)
  }
}

export const CreateBaseApiLocaleService = (resource: string) => {  
  return {
    // Get a list of resources
    list: (locale: string) => service({ requiresAuth: true }).get(`${resource}?locale=${locale}`),
    // Get a single resource by its id
    get: (id: string, locale: string) => service({ requiresAuth: true }).get(`${resource}/${id}?locale=${locale}`),    
  }
}

// export default { CreateBaseApiService, CreateBaseApiLocaleService }
