class HVue {
  constructor(options) {
    this.$options = options
    this.$data = options.data

    this.observe(this.$data)
  }
  observe(data) {
    if (!data || typeof data !== 'object') {
      return
    }
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key])
    })
  }
  defineReactive(obj, key, val) {
    Object.defineProperty(obj, key, {
      get() {
        return val;
      },
      set(newVal) {
        if (newVal !== val) {
          val = newVal
          console.log(`${key}更解了：${val}`);
        }
      }
    })
    this.observe(val) // 递归
  }
}