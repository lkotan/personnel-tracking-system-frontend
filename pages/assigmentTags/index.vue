<template>
  <section class="w-100">
    <div class="card">
      <TableHeader
        header="Görev Etiketleri"
        @create="create"
        @deleteRange="deleteRange"
        @search="key => (search = key)"
        :ruleModule=9
      />
      <div class="card-body p-0">
        <v-data-table
          :no-results-text="noResultText(search)"
          :search="search"
          v-model="selected"
          :headers="
            ruleControlUpdate(9)
              ? headers
              : headers.filter(x => x.value != 'actions')
          "
          :items="entities"
          item-key="id"
          :show-select="ruleControlDelete(9) ? true : false"
          :footer-props="{ 'items-per-page-text': 'Listelenecek :' }"
        >
          <template v-slot:item.tagColor="{ item }">
            <v-chip dark small :color="item.tagColor"> </v-chip>
          </template>

          <template v-slot:item.tagBackgroundColor="{ item }">
            <v-chip dark small :color="item.tagBackgroundColor"> </v-chip>
          </template>

          <template v-slot:item.actions="{ item }">
            <ModalBtnDropdown :id="item.id" @edit="edit(item.id)" />
          </template>
        </v-data-table>
      </div>
    </div>

    <!--INSERT MODAL-->
    <v-dialog v-model="dialog" persistent max-width="650px">
      <v-card>
        <ModalDetailHeader header="Yeni Görev Etiketi" />
        <v-card-text class="pb-0">
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-row class="row-modal">
              <v-col cols="12" md="8">
                <v-text-field
                  v-model="entity.name"
                  :rules="validation.required"
                  label="Etiket Adı"
                  placeholder="Etiket Adı"
                  dense
                  outlined
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row class="row-modal">
              <v-col cols="12" md="6">
                <v-color-picker v-model="color"></v-color-picker>
                <v-text-field
                  v-model="entity.tagColor"
                  :rules="validation.required"
                  label="Renk"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-color-picker v-model="backgroundColor"></v-color-picker>
                <v-text-field
                  v-model="entity.tagBackgroundColor"
                  :rules="validation.required"
                  label="Arkaplan Renk"
                ></v-text-field>
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
      :max-width="customModalMaxWidth(loading, false, 650)"
    >
      <Loading v-if="loading" />
      <v-card v-else>
        <ModalDetailHeader :header="updateEntity.name" />
        <v-card-text class="pb-0">
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-row class="row-modal">
              <v-col cols="12" md="8">
                <v-text-field
                  v-model="updateEntity.name"
                  :rules="validation.required"
                  label="Etiket Adı"
                  placeholder="Etiket Adı"
                  dense
                  outlined
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row class="row-modal">
              <v-col cols="12" md="6">
                <v-color-picker v-model="updateColor"></v-color-picker>
                <v-text-field
                  v-model="updateEntity.tagColor"
                  :rules="validation.required"
                  label="Renk"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-color-picker
                  v-model="updateBackgroundColor"
                ></v-color-picker>
                <v-text-field
                  v-model="updateEntity.tagBackgroundColor"
                  :rules="validation.required"
                  label="Arkaplan Renk"
                ></v-text-field>
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
   head() {
    return { title: `Görev Etiketleri ${process.env.title}` };
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
      headers: [
        { text: 'Etiket Adı', value: 'name' },
        { text: 'Renk', value: 'tagColor', width: 100, align: 'left' },
        {
          text: 'Arkaplan Renk',
          value: 'tagBackgroundColor',
          width: 175,
          align: 'center'
        },
        tableOptions.actionColumn
      ],
      type: 'rgba',
      type2: 'rgba',
      valid: true,
      loading: false,
      validation: inputValidation,
      dialog: false,
      dialogUpdate: false,
      entity: {
        id: 0,
        name: '',
        tagColor: '',
        tagBackgroundColor: ''
      },
      updateEntity: {
        id: 0,
        name: '',
        tagColor: '',
        tagBackgroundColor: ''
      }
    }
  },
  async asyncData(state) {
    await state.store.dispatch('assigmentTags/getAll')
  },
  computed: {
    ...mapGetters({
      entities: 'assigmentTags/getAll'
    }),
    color: {
      get() {
        return this[this.type]
      },
      set(v) {
        this.entity.tagColor = v.hex
      }
    },
    backgroundColor: {
      get() {
        return this[this.type2]
      },
      set(z) {
        this.entity.tagBackgroundColor = z.hex
      }
    },
    updateColor: {
      get() {
        return this[this.type]
      },
      set(v) {
        if (v.hex == '#FF0000') {
          return
        }
        this.updateEntity.tagColor = v.hex
      }
    },
    updateBackgroundColor: {
      get() {
        return this[this.type2]
      },
      set(z) {
        if (z.hex == '#FF0000') {
          return
        }
        this.updateEntity.tagBackgroundColor = z.hex
      }
    }
  },
  methods: {
    clearInput() {
      this.entity = {
        id: 0,
        name: '',
        tagBackgroundColor: '',
        tagColor: ''
      }
    },
    create() {
      this.clearInput()
      this.dialog = true
    },
      async Insert() {
      if (!this.$refs.form.validate()) return;
      await this.insertAction("assigmentTags", this.entity);
      await this.$store.dispatch("assigmentTags/getAll");
      this.dialog = false;
    },
    async edit(id) {
      this.loading = true;
      this.dialogUpdate = true;
      this.updateEntity = await this.$AssigmentTagService.Get(id);
      this.loading = false;
    },
    async Update() {
      if (!this.$refs.form.validate()) return;
      await this.updateAction("assigmentTags", this.updateEntity);
      await this.$store.dispatch("assigmentTags/getAll");
      this.dialogUpdate = false;
    },
    async deleteRange() {
      const list = this.selected.select('id')
      await this.deleteRangeAction('assigmentTags', list)
    }
  }
}
</script>

<style></style>
