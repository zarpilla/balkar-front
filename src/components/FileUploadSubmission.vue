<template>
  <div class="zcontainer">
    <!--UPLOAD-->
    <form
      enctype="multipart/form-data"
      novalidate
      v-if="isInitial || isSaving || isSuccess"
    >
      <div
        id="dropzone"
        class="dropbox"
        v-cloak
        @drop.prevent="addFile($event)"
        @dragover.prevent
      >
        <input
          type="file"
          :multiple="multiple"
          :name="uploadFieldName"
          :disabled="isSaving"          
          :accept="accept"
          class="input-file"
          @change="filesChange($event, uploadFieldName, $event.target)"
        />
        <p v-if="isInitial || isSuccess">
          {{ $t('drag-files-here') }}<br />
          {{ $t('or-click') }}          
        </p>
        <p v-if="isSaving">Pujant {{ fileCount }} arxius...</p>
      </div>
    </form>

    <div
      class="notification is-info zis-light"
      v-if="fileCount > 0 && isSaving"
      style="margin-top: 0.5rem"
    >
      <div v-if="fileCount > 0">
        <b class="subtitle">Pujant {{ fileCount }} arxius...</b>
      </div>
      <!-- <div v-if="fileCount > 0">
        <div v-for="(file, i) in fileList" v-bind:key="i">
          {{ file.name }}
        </div>
      </div> -->
    </div>

    <!--SUCCESS-->
    <div v-if="false && isSuccess">
      <h2 class="has-text-primary">
        Pujats {{ uploadedFiles.length }} arxiu(s) correctament.
      </h2>
      <p>
        <a href="javascript:void(0)" @click="reset()">Torna a pujar</a>
      </p>
    </div>
    <!--FAILED-->
    <div v-if="isFailed">
      <h2>Error de pujada.</h2>
      <p>
        <a href="javascript:void(0)" @click="reset()">Torna a provar</a>
      </p>
    </div>
  </div>
</template>


<script lang="ts">
import { ref, computed, defineComponent, defineEmits } from 'vue';
import service from "@/service/index";
import { useI18n } from 'vue-i18n';

const STATUS_INITIAL = 0,
  STATUS_SAVING = 1,
  STATUS_SUCCESS = 2,
  STATUS_FAILED = 3;


  // const props = defineProps({
  //   entity: String,
  //   refId: [String, Number],
  //   field: String,
  //   multiple: Boolean,
  //   accept: String
  // });

export default defineComponent({
  name: "FileUploadSubmission",
  props: {
    learningSpace: String,
    users_permissions_user: [String, Number],
    moduleId: String,
    multiple: Boolean,
    accept: String
  },
  // emits: ['uploaded'],
  setup(props, { emit }) {
    const uploadedFiles = ref([]);
    const uploadError = ref(null);
    const currentStatus = ref<any>(null);
    const uploadFieldName = ref("file");
    const fileCount = ref(0);
    const fileList = ref([]);
    
    const { t } = useI18n()

    const isInitial = computed(() => currentStatus.value === STATUS_INITIAL);
    const isSaving = computed(() => currentStatus.value === STATUS_SAVING);
    const isSuccess = computed(() => currentStatus.value === STATUS_SUCCESS);
    const isFailed = computed(() => currentStatus.value === STATUS_FAILED);

    // const uploaded = () => {
    //   emit('uploaded')
    // }

    // const emit = defineEmits<{
    //   (e: 'uploaded', msg: any): any
    // }>()

    const addFile = (e: Event) => {
      console.log("addFile", e);
      let fileList = (e as any).dataTransfer.files;
      if (!fileList) return;

      const formData = new FormData();

      Array.from(Array(fileList.length).keys()).map((x) => {
        formData.append('files.file', fileList[x], fileList[x].name);
      });

      const data = { moduleId: props.moduleId, learning_space: props.learningSpace, users_permissions_user: '0', field: 'file'}

      formData.append('data', JSON.stringify(data));
      // save it
      save(formData, fileList);
    };

    const reset = () => {
      // ...
      currentStatus.value = STATUS_INITIAL;
      uploadedFiles.value = [];
      uploadError.value = null;
    };

    const save = (formData: FormData, fileList: FileList) => {
      currentStatus.value = STATUS_SAVING;


      service({ requiresAuth: true, multipart: true }).post("submissions", formData)
        .then((res) => {
          console.log(res);

          
          emit('uploaded', {
            fileList: fileList,
            file: res.data
          })
          currentStatus.value = STATUS_INITIAL
        })
        .catch(err => {
          console.log(err);
          currentStatus.value = STATUS_INITIAL
        });
    };

    const filesChange = (event: any, fieldName: string, target: any) => {
      // ...

      const xfileList: FileList = target.files

      const formData = new FormData();

      if (!xfileList.length) return;

      // append the files to FormData
      Array.from(Array(xfileList.length).keys()).map((x) => {
        formData.append('files.file', xfileList[x], xfileList[x].name);
      });

      const data = { moduleId: props.moduleId, learning_space: props.learningSpace, users_permissions_user: '0', field: 'file'}

      formData.append('data', JSON.stringify(data));

      for (let i in event.target.files) {
        //@ts-ignore
        fileList.value.push(event.target.files[i]);
      }
      // save it
      save(formData, xfileList);
    };

    return {
      uploadedFiles,
      uploadError,
      currentStatus,
      uploadFieldName,
      fileCount,
      fileList,
      isInitial,
      isSaving,
      isSuccess,
      isFailed,
      addFile,
      reset,
      save,
      filesChange,
      emit
    };
  },
  mounted() {
    this.reset();
  },
});
</script>

<style scoped lang="scss">
.dropbox {
  outline: 2px dashed #020034; /* the dash box */
  outline-offset: -10px;
  background: #BBDFF7;
  color: #020034;
  padding: 10px 10px;
  min-height: 80px; /* minimum height */
  position: relative;
  cursor: pointer;
}

.input-file {
  opacity: 0; /* invisible but it's there! */
  width: 100%;
  height: 200px;
  position: absolute;
  cursor: pointer;
}

.dropbox:hover {
  background: #fff; /* when mouse over to the drop zone, change color */
}

.dropbox p {
  font-size: 1em;
  text-align: center;
  padding: 30px 0;
}
</style>
