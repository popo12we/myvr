let _Vue = null
export default class VueRouter {
  // 注册install方法如果注册过了就没必要再注册了
  static install(Vue) {
    if (VueRouter.install.installed) {
      return
    }
    VueRouter.install.installed = true
    _Vue = Vue
    _Vue.mixin({
      beforeCreate() {
        if (this.$options.router) {
          _Vue.prototype.$router = this.$options.router
          this.$options.router.init()
        }
      },
    })
  }

  constructor(options) {
    //记录传入的选项options
    this.options = options
    //路由解析规则存在这
    // 就是一个映射表{/: {…}, /about: ƒ}
    this.routeMap = {}
    //响应式对象 记录路由地址
    this.data = _Vue.observable({
      current: '/',
    })
  }
  init() {
    this.createRouteMap()
    this.initComponents(_Vue)
  }
  //解析所有的路由规则 以键值对的形式放到routeMap中
  createRouteMap() {
    this.options.routes.forEach((route) => {
      this.routeMap[route.path] = route.component
    })
  }
  //初始化router-link和router-view两个组件
  initComponents(Vue) {
    Vue.component('router-link', {
      props: {
        to: String,
      },
      render(h) {
        return h(
          'a',
          {
            attrs: {
              href: this.to,
            },
            on: {
              click: this.clickHandler,
            },
          },
          [this.$slots.default]
        )
      },
      methods: {
        clickHandler(e) {
          history.pushState({}, '', this.to)
          this.$router.data.current = this.to
          e.preventDefault()
        },
      },
    })
    const self = this
    Vue.component('router-view', {
      render(h) {
        const component = self.routeMap[self.data.current]
        console.log(component)
        return h(component)
      },
    })
  }
}
