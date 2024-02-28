import FormData from 'form-data'
export const formDataFromUrl = (params: any) => {
  const formData = new FormData()

  Object.entries(params).forEach(([key, value]) => {
    if (['document', 'image'].includes(key)) {
      formData.append(key, value, params.fileName)
    } else {
      formData.append(key, value)
    }
  })

  return formData
}

export const formDataFromUrlUser = (params: any) => {
  const formData = new FormData()

  Object.entries(params).forEach(([key, value]) => {
    if (['document', 'image'].includes(key)) {
      formData.append(key, value, params.file)
    } else {
      formData.append(key, value)
    }
  })

  return formData
}
