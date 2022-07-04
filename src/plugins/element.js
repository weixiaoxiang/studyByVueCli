import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Switch,
  Scrollbar,
  Slider,
  Select,
  Option,
  Row,
  Col,
  Tag,
  Checkbox,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Notification,
  RadioButton,
  RadioGroup,
  Table,
  TableColumn
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Switch)
Vue.use(Scrollbar) // 滚动条组件
Vue.use(Slider) // 添加滑块
Vue.use(Select) // 下拉框
Vue.use(Option)
Vue.use(Row)
Vue.use(Col)
Vue.use(Tag) // tag标签
Vue.use(Checkbox)
Vue.use(Dropdown)
Vue.use(DropdownItem)
Vue.use(DropdownMenu)
Vue.use(RadioButton)
Vue.use(RadioGroup)
Vue.use(Table)
Vue.use(TableColumn)
Vue.prototype.$message = Message
Vue.prototype.$notify = Notification
