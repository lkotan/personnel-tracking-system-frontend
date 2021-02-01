import {
  confirmOption,
  toastOption
} from "../helpers/plugin-options";
import moment from "moment";
import Vue from 'vue'
import VueMask from 'v-mask';
Vue.use(VueMask);
Vue.mixin({
  data() {
    return {
      delay: (function () {
        var timer = 0;
        return function (callback, ms) {
          clearTimeout(timer);
          timer = setTimeout(callback, ms);
        };
      })()
    }
  },
  methods: {
    getChart() {
      this.connection = this.$HubService.connectionChart()
      this.connection
        .start()
        .then(() => {
          this.connection.invoke('SendChart')
        })
        .catch(err => console.log(err))
      this.connection.on('ReceiveChart', chart => {
        this.$store.dispatch('personnels/getDashChart', chart)
      })
    },

    createAction(value, params = null) {
      if (params == null) {
        this.$router.push(`${value}/create`);
      } else {
        this.$router.push(`${value}/create?${params}`);
      }
    },
    editAction(value, id) {
      this.$router.push(`${value}/detail?id=${id}`);
    },
    async insertAction(store, entity) {
      const res = await this.$store.dispatch(`${store}/insert`, entity);
      if (!res.success) {
        this.$confirm(confirmOption.error(res.message));
        return;
      }
      return res;
    },
    async updateAction(store, entity) {
      const res = await this.$store.dispatch(`${store}/update`, entity);
      if (!res.success) {
        this.$confirm(confirmOption.error(res.message));
        return;
      }
      return res;
    },
    async deleteAction(store, id) {
      this.$confirm({
        title: "Lütfen Dikkat",
        message: `Veri kalıcı bir biçimde silinmek üzere. Emin misiniz?`,
        button: {
          no: "Hayır",
          yes: "Evet",
        },
        callback: async (confirm) => {
          if (confirm) {
            const res = await this.$store.dispatch(`${store}/delete`, id);
            if (!res.success) {
              this.$confirm(confirmOption.error(res.message));
              return;
            }
            if (store == "assigments") {
              this.getChart()
              return;
            }
            this.$confirm(confirmOption.info("Kayıt başarıyla silindi."));
            return res;
          }
        },
      });
    },
    async deleteRangeAction(store, list, parentId = null) {
      if (list.length == 0) {
        this.$confirm(confirmOption.error("Silinecek kayıtları seçmediniz."));
        return;
      }
      this.$confirm({
        title: "Lütfen Dikkat",
        message: `Veriler kalıcı bir biçimde silinmek üzere. Emin misiniz?`,
        button: {
          no: "Hayır",
          yes: "Evet",
        },
        callback: async (confirm) => {
          if (confirm) {
            let models = this.$store.getters[`${store}/getAll`].select("id");
            let idList = [];
            list.forEach(x => {
              if (models.indexOf(x) >= 0) idList.push(x);
            });
            let res = await this.$store.dispatch(`${store}/deleteRange`, idList);
            let messages = "";
            res.forEach(r => {
              if (!r.success) messages += messages == "" ? r.data + " " + r.message : '\n' + r.data + " " + r.message;
            });

            if (messages != "") this.$confirm(confirmOption.error(messages));
            else this.$confirm(confirmOption.info('Kayıtlar başarıyla silindi'));
            return res;
          }
        },
      });

    },
    async isBlockedChangeAction(store, id) {
      const res = await this.$store.dispatch(`${store}/isBlockedChange`, id);
      this.$toast.show(res.message, !res.success ? toastOption.error : toastOption.success);
    },
    wait(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    dateNow() {
      return moment().format("YYYY");
    },
    fromNow(date) {
      return moment(date).locale("tr").fromNow();
    },
    formatDate(date, pattern = null) {
      return moment(date).locale("tr").format(pattern == null ? "DD.MM.YYYY HH:mm:ss" : pattern);
    },
    personnelName() {
      return this.$auth.$state.user.firstName + " " + this.$auth.$state.user.lastName;
    },
    isAdmin() {
      if (this.$auth.user.personnelType == 20) return true;
      return false;
    },
    personnelPhoto(path) {
      if (path == "" || path == null) return '/profile.png';
      //Photo'ları tutulduğu yerin path
      //return process.env.profilePath + path;
    },
    ruleControlInsert(applicationModule) {
      if (this.isAdmin()) return this.isAdmin();
      let module = this.$auth.user.rules.filter(x => x.applicationModule == applicationModule)[0];
      if (module.insert) return true;
      return false;
    },
    ruleControlUpdate(applicationModule) {
      if (this.isAdmin()) return this.isAdmin();
      let module = this.$auth.user.rules.filter(x => x.applicationModule == applicationModule)[0];
      if (module.update) return true;
      return false;
    },
    ruleControlDelete(applicationModule) {
      if (this.isAdmin()) return this.isAdmin();
      let module = this.$auth.user.rules.filter(x => x.applicationModule == applicationModule)[0];
      if (module.delete) return true;
      return false;
    },
    ruleControlView(applicationModule) {
      if (this.isAdmin()) return this.isAdmin();
      if (applicationModule != undefined) {
        let module = this.$auth.user.rules.filter(x => x.applicationModule == applicationModule)[0];
        if (module != undefined) {
          if (module.view) return true;
          return false;
        }
      }
    },
    customModalMaxWidth(loading, customScreen, insertModalWidth = "600px") {
      if (loading) return "344px";
      else if (customScreen) return "768px";
      return insertModalWidth;
    },
  }
})
