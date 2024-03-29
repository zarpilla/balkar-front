<script setup lang="ts">
import { reactive } from 'vue'
import FormData from 'form-data'
import service from '@/service'
import { formDataFromUrl } from '@/utils/uploadTool'

const props = defineProps({
  api: {
    type: String,
    required: true
  },
  method: {
    type: String,
    default: 'put',
    validator: (value: string) => {
      return ['put', 'post'].includes(value)
    }
  }
})

const data = reactive({
  fileType: '',
  fileImage: new URL(`../assets/images/upload.svg`, import.meta.url).href,
  fileNoImage: new URL(`../assets/images/upload.svg`, import.meta.url).href,
  uploadImages: false,
  uploadError: false,
  uploadErrorMessage: '',
  uploading: false,
  uploaded: false,
  allowedExtensions: [
    'png',
    'jpg',
    'jpeg',
    'tif',
    'gif',
    'doc',
    'docx',
    'xls',
    'xlsx',
    'ppt',
    'pptx',
    'mp4',
    'mp3',
    'pdf',
    'm4a',
    'mov',
    'psd',
    'csv',
    'json',
    'zip'
  ],
  allowedImageTypes: ['png', 'jpg', 'jpeg', 'tif', 'gif', 'svg'],
  allowedFileTypes: [
    'pdf',
    'doc',
    'docx',
    'xls',
    'xlsx',
    'ppt',
    'pptx',
    'mp4',
    'mp3',
    'm4a',
    'mov',
    'psd',
    'csv',
    'json',
    'zip'
  ]
})

const getImgUrl = (filePath: string) => {
  console.log('filePath', filePath)
  return new URL(filePath, import.meta.url).href
}

const getValidExtensions = () => {
  return data.allowedImageTypes.map((item: string) => `.${item}`).join(',')
}

const emit = defineEmits<{
  (e: 'uploaded', pictureUrl: string): { pictureUrl: string }
}>()

const toBase64 = (file: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
  })

const processUpload = async (event: any) => {
  data.uploading = true

  if (event.target.files.length > 0) {
    const fileExtension = event.target.files[0].name.split('.').pop()
    let fileType: undefined | string

    if (data.allowedImageTypes.includes(fileExtension)) {
      fileType = 'image'
      data.fileImage = await toBase64(event.target.files[0])
    } else if (data.allowedFileTypes.includes(fileExtension)) {
      fileType = 'doc'
      data.fileImage = getImgUrl(data.fileNoImage)
    } else {
      data.uploadError = true
      data.uploadErrorMessage = 'Cannot upload file'
    }

    const uploadFile: any = {
      fileName: event.target.files[0].name,
      image: event.target.files[0]
    }

    const file: FormData = formDataFromUrl(uploadFile)

    const formData = new FormData();

    let fileList = event.target.files;
    if (!fileList) return;

    Array.from(Array(fileList.length).keys()).map((x) => {
        formData.append('files.avatar', fileList[x], fileList[x].name);
    });

    formData.append('data', JSON.stringify({ users_permissions_user: '0', field: 'avatar'}));


    if (fileType == 'image') {
      if (props.method === 'post') {
        await service({ requiresAuth: true, multipart: true }).post(props.api, formData)
      } else {
        await service({ requiresAuth: true, multipart: true }).put(props.api, formData)
      }
      
      // await service({ requiresAuth: true }).put(props.api, formData, {
      //   headers: { 'Content-Type': 'multipart/form-data' }
      // })
      emit('uploaded', data.fileImage)
    }

    data.uploading = false
    data.uploaded = true
  }
}
</script>

<template>
  <div class="upload-wrapper">
    <div class="file-upload">
      <input type="file" :accept="getValidExtensions()" @change="processUpload($event)" />
      <button
        type="button"
        class="upload-button btn zbtn-secondary zposition-absolute button-upload"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.8337 5.41701H14.767L14.5003 4.58368C14.3275 4.0947 14.0068 3.6716 13.5827 3.37298C13.1587 3.07436 12.6523 2.91501 12.1337 2.91701H7.86699C7.34328 2.91799 6.8331 3.08341 6.40846 3.38993C5.98382 3.69645 5.66617 4.12859 5.50033 4.62534L5.23366 5.45868H4.16699C3.50395 5.45868 2.86807 5.72207 2.39923 6.19091C1.93038 6.65975 1.66699 7.29564 1.66699 7.95868V14.6253C1.66699 15.2884 1.93038 15.9243 2.39923 16.3931C2.86807 16.862 3.50395 17.1253 4.16699 17.1253H15.8337C16.4967 17.1253 17.1326 16.862 17.6014 16.3931C18.0703 15.9243 18.3337 15.2884 18.3337 14.6253V7.95868C18.3392 7.62688 18.2786 7.29731 18.1555 6.98917C18.0323 6.68103 17.849 6.40049 17.6163 6.16391C17.3836 5.92734 17.1062 5.73945 16.8001 5.61122C16.494 5.48298 16.1655 5.41697 15.8337 5.41701ZM16.667 14.5837C16.667 14.8047 16.5792 15.0167 16.4229 15.1729C16.2666 15.3292 16.0547 15.417 15.8337 15.417H4.16699C3.94598 15.417 3.73402 15.3292 3.57774 15.1729C3.42146 15.0167 3.33366 14.8047 3.33366 14.5837V7.91701C3.33366 7.696 3.42146 7.48404 3.57774 7.32776C3.73402 7.17148 3.94598 7.08368 4.16699 7.08368H5.83366C6.01538 7.09316 6.19521 7.04291 6.34569 6.94058C6.49616 6.83826 6.60901 6.6895 6.66699 6.51701L7.11699 5.15034C7.1729 4.98483 7.27941 4.84107 7.42147 4.73938C7.56353 4.63769 7.73396 4.58323 7.90866 4.58368H12.1753C12.35 4.58323 12.5205 4.63769 12.6625 4.73938C12.8046 4.84107 12.9111 4.98483 12.967 5.15034L13.417 6.51701C13.4705 6.67597 13.5707 6.81509 13.7045 6.91619C13.8383 7.01729 13.9995 7.07566 14.167 7.08368H15.8337C16.0547 7.08368 16.2666 7.17148 16.4229 7.32776C16.5792 7.48404 16.667 7.696 16.667 7.91701V14.5837ZM10.0003 7.08368C9.34105 7.08368 8.69659 7.27917 8.14843 7.64545C7.60026 8.01172 7.17302 8.53231 6.92073 9.1414C6.66843 9.75049 6.60242 10.4207 6.73104 11.0673C6.85966 11.7139 7.17713 12.3079 7.6433 12.774C8.10948 13.2402 8.70342 13.5577 9.35002 13.6863C9.99663 13.8149 10.6669 13.7489 11.2759 13.4966C11.885 13.2443 12.4056 12.8171 12.7719 12.2689C13.1382 11.7207 13.3337 11.0763 13.3337 10.417C13.3337 9.53296 12.9825 8.68511 12.3573 8.05999C11.7322 7.43487 10.8844 7.08368 10.0003 7.08368ZM10.0003 12.0837C9.67069 12.0837 9.34846 11.9859 9.07438 11.8028C8.80029 11.6197 8.58667 11.3594 8.46053 11.0548C8.33438 10.7503 8.30137 10.4152 8.36568 10.0919C8.42999 9.76856 8.58873 9.47159 8.82181 9.2385C9.0549 9.00541 9.35187 8.84668 9.67517 8.78237C9.99848 8.71806 10.3336 8.75107 10.6381 8.87721C10.9427 9.00336 11.203 9.21698 11.3861 9.49106C11.5692 9.76514 11.667 10.0874 11.667 10.417C11.667 10.859 11.4914 11.283 11.1788 11.5955C10.8663 11.9081 10.4424 12.0837 10.0003 12.0837Z"
            fill="#020034"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.rotar {
  animation-name: rotate;
  animation-duration: 5s;
  animation-iteration-count: infinite;
  animation-timing-function: cubic-bezier(0.1, 0.15, 0.25, 0.25);
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.upload-container {
  width: 100% !important;
}

.upload-wrapper {
}

.upload-wrapper .file-upload {
  height: auto;
  width: auto;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  transition: all 1s;
  cursor: pointer;
}

.upload-wrapper input[type='file'] {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  cursor: pointer;
}

.error-upload {
  font-family: 'SF Pro Rounded', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1rem;
  letter-spacing: 0.3px;
  color: #ff6666;
  margin-top: 1.5rem;
}

.preview {
  width: 15rem !important;
  height: 15rem !important;
  margin-top: 2rem;
  position: relative;
  overflow: hidden;
}

.preview:hover::after {
  content: '';
  width: 100%;
  height: 100%;
  background-color: #000;
  opacity: 0.4;
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
}

.preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview:hover img {
  width: 120%;
  height: 120%;
  transition: all 1.2s ease-in-out !important;
  animation: fadeIn 1.2s;
  animation-fill-mode: forwards;
}

.to-right {
  display: flex;
  justify-content: end;
}

.to-left {
  display: flex;
  justify-content: start;
}

.preview_docs {
  width: 15rem !important;
  height: 15rem !important;
  margin-top: 2rem;
  position: relative;
  overflow: hidden;
}

.preview:hover::after {
  content: '';
  width: 100%;
  height: 100%;
  background-color: #000;
  opacity: 0.4;
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
}

.preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview:hover img {
  width: 120%;
  height: 120%;
  transition: all 1.2s ease-in-out !important;
  animation: fadeIn 1.2s;
  animation-fill-mode: forwards;
}

/* .spinner {
  background-color: #fff;
  height: 2rem;
  width: 2rem;
  display: block;
  mask: url('@/assets/images/spinner.svg') no-repeat center / 100%;
  -webkit-mask: url('@/assets/images/spinner.svg') no-repeat center / 100%;
} */

.upload-wrapper .file-upload:hover .upload-button .spinner {
  background-color: #fff;
}

.upload {
  background-color: #fff;
  height: 2rem;
  width: 2rem;
  display: block;
  /* mask: url('@/assets/images/upload.svg') no-repeat center / 100%;
  -webkit-mask: url('@/assets/images/upload.svg') no-repeat center / 100%; */

  position: absolute;
  bottom: -10px;
  left: 80px;
}

.upload-wrapper .file-upload:hover .upload-button .upload {
  background-color: #0450cd;
}

.upload-button{
  background-color: var(--blanc, #fff);
  border: 2px solid var(--blanc, #020034);
  border-radius: 50px;
  height: 46px;
}

.upload-button span.normal {
  display: flex;
  line-height: 2rem;
}

.upload-button span.normal .upload {
  margin-right: 1rem;
}
</style>
