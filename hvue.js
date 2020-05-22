class HVue {
  constructor(options) {
    this.$options = options
    this.$data = options.data

    this.observe(this.$data) // 实现$data响应式
  }
  observe(data) {
    if (!data || typeof data !== 'object') {
      return
    }
    // 获取data中所有的key,为所有的key添加响应式
    Object.keys(data).forEach(key => {
      // 单独创建一个函数是有目的，后续会有说明
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
          console.log(`${key}更新了，新值是：${val}`);
        }
      }
    })
    this.observe(val) // data对中的每个属性值也可能是对象，通过递归实现响应化
  }
}