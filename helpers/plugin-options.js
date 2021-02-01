const confirmOption = {
  info: (message, title = "Bilgi", button = "Tamam") => {
    return {
      title,
      message,
      button: {
        yes: button,
      },
    }
  },
  error: (message, title = "Hata", button = "Kapat") => {
    return {
      title,
      message,
      button: {
        yes: button,
      },
    }
  },
  success: (message, title = "Başarılı", button = "Tamam") => {
    return {
      title,
      message,
      button: {
        yes: button,
      },
    }
  }
}
const tableOptions = {
  defaultData: {
    search: "",
    selected: [],
    selectedModal: []
  },
  actionColumn: {
    text: "İşlem",
    value: "actions",
    width: 50,
    sortable: false,
    filterable: false
  },
  isBlockedColumn: {
    text: "Pasif",
    value: "isBlocked",
    width: 90,
    sortable: false,
    filterable: false,
  }
}
const toastOption = {
  warning: {
    duration: 1250,
    iconPack: 'custom-class',
    icon: 'ti-alert mr-2',
    theme: 'bubble',
    type: 'warning'
  },
  error: {
    duration: 1250,
    iconPack: 'custom-class',
    icon: 'ti-alert mr-2',
    theme: 'bubble',
    type: 'error'
  },
  success: {
    duration: 1250,
    iconPack: 'custom-class',
    icon: 'ti-check mr-2',
    theme: 'bubble',
    type: 'success'
  }
}

export {
  confirmOption,
  tableOptions,
  toastOption
};
