import './util/creatElement';
import IndexPage from './page/Index';

const bodyDom = document.getElementsByTagName('body')[0];
const appDom = document.getElementById('app');
bodyDom.replaceChild(IndexPage(), appDom);