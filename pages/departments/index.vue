<template>
  <section class="w-100">
    <div class="card">
      <TableHeader
        header="Departmanlar"
        @create="create"
        @deleteRange="deleteRange"
        @search="(key) => (search = key)"
        :ruleModule=4
      />
      <div class="card-body p-0">
        <v-data-table
          :no-results-text="noResultText(search)"
          :search="search"
          v-model="selected"
          :headers="ruleControlUpdate(4)
              ? headers
              : headers.filter(x => x.value != 'actions')"
          :items="entities"
          item-key="id"
          show-select
          :items-per-page="-1"
          :hide-default-footer="true"
        >
          <template v-slot:item.actions="{ item }">
            <ModalBtnDropdown :id="item.id" @edit="edit(item.id)" />
          </template>
        </v-data-table>
      </div>
    </div>

    <!--INSERT MODAL-->
    <v-dialog v-model="dialog" persistent max-width="350px">
      <v-card>
        <ModalDetailHeader header="Yeni Departman" />
        <v-card-text class="pb-0">
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-row class="row-modal">
              <v-col cols="12" md="12">
                <v-text-field
                  v-model="entity.name"
                  :rules="validation.required"
                  label="Departman Adı"
                  placeholder="Departman Adı"
                  dense
                  outlined
                >
                </v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <ModalDetailFooter @insert="Insert" @cancel="dialog = false" />
      </v-card>
    </v-dialog>

     <!--UPDATE MODAL-->
    <v-dialog
      v-model="dialogUpdate"
      persistent
      :max-width="customModalMaxWidth(loading, false,350)"
    >
      <Loading v-if="loading" />
      <v-card v-else>
        <ModalDetailHeader :header="updateEntity.name" />
        <v-card-text class="pb-0">
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-row class="row-modal">
              <v-col cols="12" md="12">
                <v-text-field
                  v-model="updateEntity.name"
                  :rules="validation.required"
                  label="Departman Adı"
                  placeholder="Departman Adı"
                  dense
                  outlined
                >
                </v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <ModalDetailFooter
          :isUpdate="true"
          @update="Update"
          @cancel="dialogUpdate = false"
        />
      </v-card>
    </v-dialog>
  </section>
</template>
<script>
import { mapGetters } from 'vuex'
import { tableOptions, confirmOption } from '@/helpers/plugin-options'
import { inputValidation } from '@/helpers/vuetify'
import TableHeader from '@/components/shared/table/header'
import ModalBtnDropdown from '@/components/shared/modal-dropdown/btn-dropdown'
import ModalDetailHeader from '@/components/shared/modal-detail/header'
import ModalDetailFooter from '@/components/shared/modal-detail/footer'
import Loading from '@/components/shared/modal-loading'

export default {
  middleware: "auth-user",
  head() {
    return { title: `Departman ${process.env.title}` };
  },
  components: {
    TableHeader,
    ModalBtnDropdown,
    ModalDetailHeader,
    ModalDetailFooter,
    Loading
  },
  data() {
    return {
      ...tableOptions.defaultData,
      headers: [{ text: "Ünvanlar", value: "name" }, tableOptions.actionColumn],
      valid: true,
      loading: false,
      validation: inputValidation,
      dialog: false,
      dialogUpdate: false,
      entity: { id: 0, name: "" },
      updateEntity:{id:0,name:""},
    };
  },
  async asyncData(state) {
    await state.store.dispatch("departments/getAll");
  },
  computed: {
    ...mapGetters({
      entities: "departments/getAll",
    }),
  },
  methods: {
    clearInput(){
      this.entity= { id: 0, name: "" };
    },
    create() {
      this.clearInput();
      this.dialog=true;
    },
    async Insert() {
      if (!this.$refs.form.validate()) return;
      await this.insertAction("departments", this.entity);
      await this.$store.dispatch("departments/getAll");
      this.dialog = false;
    },
   async edit(id){
      this.loading = true;
      this.dialogUpdate = true;
      this.updateEntity = await this.$DepartmentService.Get(id);
      this.loading = false;
    },
    async Update(){
      if (!this.$refs.form.validate()) return;
      await this.updateAction("departments", this.updateEntity);
      await this.$store.dispatch("departments/getAll");
      this.dialogUpdate = false;
    },
    async deleteRange() {
      await this.deleteRangeAction("titles", this.selected.select("id"));
    },
  },
};
</script>