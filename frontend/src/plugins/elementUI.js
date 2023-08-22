import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css'

import Vue from 'vue'
import { Row, Col, Form, FormItem, Input, Button, Avatar, Image, Message } from 'element-ui'

Vue.use(Row)
Vue.use(Col)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
Vue.use(Avatar)
Vue.use(Image)

Vue.prototype.$message = Message