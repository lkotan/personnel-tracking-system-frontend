<template>
  <section class="w-100">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div class="row">
              <div class="w-100">
                <div
                  class="w-100 d-flex flex-wrap align-items-center bg-light p-3 rounded-sm mb-3"
                >
                  <div
                    class="text-center d-flex align-items-center col-12 col-md position-relative"
                  >
                    <v-avatar size="96">
                      <v-img
                        :src="
                          personnelPhoto(profile.personnelInfo.profilePhoto)
                        "
                      ></v-img>
                    </v-avatar>
                    <div class="pl-3 d-flex flex-wrap justify-content-start">
                      <div class="d-flex align-items-center">
                        <h4>
                          {{ profile.personnelInfo.firstName }}
                          {{ profile.personnelInfo.lastName }}
                        </h4>
                        <v-hover v-slot:default="{ hover }">
                          <v-chip
                            class="ml-3 mb-1"
                            small
                            color="blue-grey darken-4"
                            dark
                          >
                            İletişim
                            <v-fab-transition>
                              <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                  <v-btn
                                    v-bind="attrs"
                                    v-on="on"
                                    small
                                    icon
                                    class="ml-2"
                                    v-show="hover"
                                  >
                                    <v-icon small>mdi-email-outline</v-icon>
                                  </v-btn>
                                </template>
                                <span>{{ profile.email }}</span>
                              </v-tooltip>
                            </v-fab-transition>
                            <v-fab-transition>
                              <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                  <v-btn
                                    v-bind="attrs"
                                    v-on="on"
                                    small
                                    icon
                                    class="ml-2"
                                    v-show="hover"
                                  >
                                    <v-icon small>mdi-phone</v-icon>
                                  </v-btn>
                                </template>
                                <span>{{ profile.gsm }}</span>
                              </v-tooltip>
                            </v-fab-transition>
                          </v-chip>
                        </v-hover>
                      </div>
                      <div class="d-flex flex-wrap w-100">
                        <h5 class="mb-0 text-muted text-left w-100">
                          {{ profile.title
                          }}{{
                            profile.department != ''
                              ? ' - ' + profile.department
                              : profile.department
                          }}
                        </h5>
                      </div>
                      <div class="w-100 d-flex flex-wrap">
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-chip
                              dark
                              small
                              color="blue-grey darken-4"
                              @click="clearInput, (changePasswordModal = true)"
                              rounded
                              class="mt-2 mr-2"
                              v-bind="attrs"
                              v-on="on"
                            >
                              <v-icon x-small>mdi-key-change</v-icon>
                            </v-chip>
                          </template>
                          <span>Şifre Değiştir</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-chip
                              dark
                              small
                              color="blue-grey darken-4"
                              rounded
                              class="mt-2 mr-2"
                              v-bind="attrs"
                              v-on="on"
                            >
                              {{ profile.assigmentCount }}
                            </v-chip>
                          </template>
                          <span>Görev Sayısı</span>
                        </v-tooltip>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <v-dialog v-model="changePasswordModal" max-width="325">
      <v-card>
        <v-toolbar flat color="white pb-0 pt-1">
          <span style="font-size:18px !important;" class="headline mb-2 ml-3"
            >Şifre Değiştir</span
          >
        </v-toolbar>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-row class="row-modal">
              <v-col cols="12">
                <v-text-field
                  v-model="model.oldPassword"
                  type="password"
                  label="Eski Şifreniz"
                  dense
                  placeholder="*********"
                  outlined
                  :rules="validation.required"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="model.newPassword"
                  type="password"
                  label="Yeni Şifreniz"
                  dense
                  placeholder="*********"
                  outlined
                  :rules="validation.required"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="pt-0">
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="changePasswordModal = false"
          >
            Vazgeç
          </v-btn>
          <v-btn color="blue darken-1" text @click="changeMyPassword">
            Kaydet
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </section>
</template>

<script>
import { inputValidation } from '@/helpers/vuetify'
import { toastOption } from '@/helpers/plugin-options'

export default {
  middleware: 'auth-user',
  head() {
    return { title: `Hesabım ${process.env.title}` }
  },
  data() {
    return {
      valid:false,
      changePasswordModal: false,
      changePasswordStep: 1,
      model: {
        oldPassword: '',
        newPassword: ''
      },
      validation: inputValidation
    }
  },
  async asyncData(state) {
    const data = await state.store.$PersonnelService.Profile()
    return {
      profile: data
    }
  },
  computed: {},
  methods: {
    clearInput() {
      this.model = {
        oldPassword: '',
        newPassword: ''
      }
    },
    async changeMyPassword() {
      if (!this.$refs.form.validate()) return

      const res=await this.$AuthService.ChangePassword(this.model);
      this.$toast.show(
        res.message,
        !res.success ? toastOption.error : toastOption.success
      )
      this.changePasswordModal=false;
    }
  }
}
</script>
<style>
.profile-avatar-actions > div {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.41);
  transition: 0.3s;
  opacity: 0;
  visibility: hidden;
}

.profile-avatar-actions > div span a {
  color: #fff !important;
}

.profile-avatar-actions:hover > div {
  visibility: visible;
  opacity: 1;
}

.profile-avatar-actions {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  cursor: pointer;
  height: 100%;
}
</style>
