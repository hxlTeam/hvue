class HVue {
  constructor(options) {
    this.$options = options
    this.$data = options.data

    this.observe(this.$data) // 实现$data响应式

    // new Watcher()
    // this.$data.message
    // new Watcher()
    // this.$data.foo.bar
    new Compile(options.el, this)
    if (options.created) {
      options.created.call(this)
    }
  }
  observe(data) {
    if (!data || typeof data !== 'object') {
      return
    }
    // 获取data中所有的key,为所有的key添加响应式
    Object.keys(data).forEach(key => {
      // 单独创建一个函数是有目的，后续会有说明
      this.defineReactive(data, key, data[key])
      // 属性代码到vm上 
      this.proxyData(key)
    })
  }
  proxyData(key) {
    Object.defineProperty(this, key, {
      get() {
        return this.$data[key];
      },
      set(newVal) {
        this.$data[key] = newVal
      }
    })
  }
  defineReactive(obj, key, val) {
    const dep = new Dep(); // 为每个属性都创建一个dep实例
    Object.defineProperty(obj, key, {
      get() {
        Dep.target && dep.addDep(Dep.target)
        return val;
      },
      set(newVal) {
        if (newVal !== val) {
          val = newVal
          // console.log(`${key}更新了，新值是：${val}`);
          dep.notify()
        }
      }
    })
    this.observe(val) // data对中的每个属性值也可能是对象，通过递归实现响应化
  }
}

class Dep {
  constructor() {
    this.deps = [] // 每一属性都对应一个dep，每个dep可以对应多个watcher，所以用一个数组存储相应的watcher
  }
  addDep(dep) {
    this.deps.push(dep)
  }
  notify() { // 通知更新视图
    this.deps.forEach(dep => dep.update())
  }
}

class Watcher {
  constructor(vm, key, cb) {
    this.vm = vm
    this.key = key
    this.cb = cb

    Dep.target = this // 每新建一个watcher实例时，会将Dep的静态属性指向新的实例
    this.vm[this.key] // 添加watcher到dep
    Dep.target = null
  }
  update() {
    // console.log('属性更新了');
    this.cb.call(this.vm, this.vm[this.key])
  }
}