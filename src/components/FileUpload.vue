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
        />
        <p v-if="isInitial || isSuccess">
          Arrossega arxius aquí<br />
          o fes clic
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
  name: "FileUpload",
  props: {
    entity: String,
    refId: [String, Number],
    field: String,
    multiple: Boolean,
    accept: String
  },
  // emits: ['uploaded'],
  setup(props) {
    const uploadedFiles = ref([]);
    const uploadError = ref(null);
    const currentStatus = ref<any>(null);
    const uploadFieldName = ref("photos");
    const fileCount = ref(0);
    const fileList = ref([]);

    const isInitial = computed(() => currentStatus.value === STATUS_INITIAL);
    const isSaving = computed(() => currentStatus.value === STATUS_SAVING);
    const isSuccess = computed(() => currentStatus.value === STATUS_SUCCESS);
    const isFailed = computed(() => currentStatus.value === STATUS_FAILED);

    // const uploaded = () => {
    //   emit('uploaded')
    // }

    const emit = defineEmits<{
      (e: 'uploaded', msg: any): any
    }>()

    const addFile = (e: Event) => {
      console.log("addFile", e);
      let fileList = (e as any).dataTransfer.files;
      if (!fileList) return;

      const formData = new FormData();

      Array.from(Array(fileList.length).keys()).map((x) => {
        formData.append('files', fileList[x], fileList[x].name);
      });
      formData.append('ref', props.entity as string)
      formData.append('refId', props.refId as string)
      formData.append('field', props.field as string)

      fileCount.value = fileList.length;

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


      service({ requiresAuth: true, multipart: true }).post("upload", formData)
        .then((res) => {
          console.log(res);

          
          emit('uploaded', {
            entity: props.entity,
            refId: props.refId,
            field: props.field,
            fileList: fileList,
            documents: res.data
          })
          // this.$emit("uploaded", {
          //   entity: this.entity,
          //   refId: this.refId,
          //   field: this.field,
          //   fileList: fileList,
          //   documents: res.data
          // });
          currentStatus.value = STATUS_INITIAL
          // this.$buefy.snackbar.open({
          //   message: 'Pujat correctament',
          //   queue: false
          // })
        })
        .catch(err => {
          console.log(err);
          currentStatus.value = STATUS_INITIAL
          // this.$buefy.snackbar.open({
          //   message: 'Error pujant arxiu',
          //   queue: false
          // })
        });
    };

    const filesChange = (event: any, fieldName: string, xfileList: FileList) => {
      // ...

      const formData = new FormData();

      if (!xfileList.length) return;

      // append the files to FormData
      Array.from(Array(xfileList.length).keys()).map((x) => {
        formData.append('files', xfileList[x], xfileList[x].name);
      });

      formData.append('ref', props.entity as string)
      formData.append('refId', props.refId as string)
      formData.append('field', props.field as string)

      //fileCount.value = event.target.files.length;
      //this.fileList = event.target.files
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
      filesChange
    };
  },
  mounted() {
    this.reset();
  },
});
</script>
<!-- 
<script lang="ts">
import service from "@/service/index";

const STATUS_INITIAL = 0,
  STATUS_SAVING = 1,
  STATUS_SUCCESS = 2,
  STATUS_FAILED = 3;

export default {
  name: "FileUpload",
  data() {
    return {
      uploadedFiles: [],
      uploadError: null,
      currentStatus: null,
      uploadFieldName: "photos",
      fileCount: 0,
      fileList: [],
    };
  },
  props: {
    entity: String,
    refId: [String,Number],
    field: String,
    multiple: Boolean,
    accept: String
  },
  computed: {
    isInitial() {
      return this.currentStatus === STATUS_INITIAL;
    },
    isSaving() {
      return this.currentStatus === STATUS_SAVING;
    },
    isSuccess() {
      return this.currentStatus === STATUS_SUCCESS;
    },
    isFailed() {
      return this.currentStatus === STATUS_FAILED;
    },
  },
  methods: {
    addFile(e) {
      console.log("addFile", e);
      let fileList = e.dataTransfer.files;
      if (!fileList) return;

      const formData = new FormData();

      Array.from(Array(fileList.length).keys()).map((x) => {
        formData.append('files', fileList[x], fileList[x].name);
      });
      formData.append('ref', this.entity)
      formData.append('refId', this.refId)
      formData.append('field', this.field)

      this.fileCount = fileList.length;

      // save it
      this.save(formData, fileList);
    },
    reset() {
      // reset form to initial state
      this.currentStatus = STATUS_INITIAL;
      this.uploadedFiles = [];
      this.uploadError = null;
    },
    save(formData, fileList) {
      // upload data to the server
      this.currentStatus = STATUS_SAVING;


      service({ requiresAuth: true, multipart: true }).post("upload", formData)
        .then((res) => {
          console.log(res);
          this.$emit("uploaded", {
            entity: this.entity,
            refId: this.refId,
            field: this.field,
            fileList: fileList,
            documents: res.data
          });
          this.currentStatus = STATUS_INITIAL
          this.$buefy.snackbar.open({
            message: 'Pujat correctament',
            queue: false
          })
        })
        .catch(err => {
          console.log(err);
          this.currentStatus = STATUS_INITIAL
          this.$buefy.snackbar.open({
            message: 'Error pujant arxiu',
            queue: false
          })
        });
      
    },
    filesChange(event, fieldName, fileList) {
      // console.log('(event, fieldName, fileList)', event, fieldName, fileList)
      // handle file changes
      const formData = new FormData();

      if (!fileList.length) return;

      // append the files to FormData
      Array.from(Array(fileList.length).keys()).map((x) => {
        formData.append('files', fileList[x], fileList[x].name);
      });

      formData.append('ref', this.entity)
      formData.append('refId', this.refId)
      formData.append('field', this.field)

      this.fileCount = event.target.files.length;
      //this.fileList = event.target.files
      for (let i in event.target.files) {
        this.fileList.push(event.target.files[i]);
      }
      // save it
      this.save(formData, fileList);
    },
  },
  mounted() {
    this.reset();
  },
};
</script> -->

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.dropbox {
  outline: 2px dashed #aaa; /* the dash box */
  outline-offset: -10px;
  background: #f9f9f9;
  background: #BBDFF7;
  color: dimgray;
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
  background: #ddd; /* when mouse over to the drop zone, change color */
}

.dropbox p {
  font-size: 1em;
  text-align: center;
  padding: 30px 0;
}
</style>
