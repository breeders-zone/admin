/*!

=========================================================
* Argon Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Index from "./views/Index";
import Profile from "./views/Profile";
import Login from "./views/Login";
import Products from "./views/Products";
import Product from "./views/Product";
import Divorces from "./views/Divorces";
import Divorce from "./views/Divorce";
import Kinds from "./views/Kinds";
import Kind from "./views/Kind";
import Subcategories from "./views/Subcategories";
import Subcategory from "./views/Subcategory";
import Localities from "./views/Localities";
import Locality from "./views/Locality";
import Genes from "./views/Genes";
import Gene from "./views/Gene";
import Traits from "./views/Traits";
import Trait from "./views/Trait";
import Users from "./views/Users";
import User from "./views/User";
import Reports from "./views/Reports";
import Report from "./views/Report";
import Level from "./views/Level";
import Levels from "./views/Levels";
import Faqs from "./views/Faqs";
import Faq from "./views/Faq";
import Documents from "./views/Documents";
import Document from "./views/Document";

var routes = [
    {
        path: "/index",
        name: "Рабочий стол",
        icon: "ni ni-tv-2 text-primary",
        component: Index,
        layout: "/admin"
    },
    {
        path: "/products/:id",
        component: Product,
        layout: "/admin"
    },
    {
        path: "/products",
        name: "Продукты",
        icon: "ni ni-cart text-blue",
        component: Products,
        layout: "/admin"
    },
    {
        path: "/divorces/:id",
        component: Divorce,
        layout: "/admin"
    },
    {
        path: "/divorces",
        name: "Разводы",
        icon: "fa fa-egg",
        component: Divorces,
        layout: "/admin"
    },
    {
        path: "/users/:id",
        component: User,
        layout: "/admin"
    },
    {
        path: "/users",
        name: "Пользователи",
        icon: "ni ni-single-02 text-info",
        component: Users,
        layout: "/admin"
    },
    {
        path: "/reports/:id",
        component: Report,
        layout: "/admin"
    },
    {
        path: "/reports",
        name: "Жалобы",
        icon: "fas fa-exclamation-circle text-red",
        component: Reports,
        layout: "/admin"
    },
    {
        path: "/faq/add",
        component: Faq,
        layout: "/admin"
    },
    {
        path: "/faq/:label",
        component: Faq,
        layout: "/admin"
    },
    {
        path: "/faq",
        name: "FAQ",
        icon: "ni ni-books text-blue",
        component: Faqs,
        layout: "/admin"
    },
    {
        path: "/documents/add",
        component: Document,
        layout: "/admin"
    },
    {
        path: "/documents/:label",
        component: Document,
        layout: "/admin"
    },
    {
        path: "/documents",
        name: "Документы",
        icon: "ni ni-folder-17 text-yellow  ",
        component: Documents,
        layout: "/admin"
    },
    {
        path: "/kinds/add",
        component: Kind,
        layout: "/admin"
    },
    {
        path: "/kinds/:id",
        component: Kind,
        layout: "/admin"
    },
    {
        path: "/kinds",
        name: "Категории",
        icon: "ni ni-archive-2 text-orange",
        component: Kinds,
        layout: "/admin"
    },
    {
        path: "/subcategories/add",
        component: Subcategory,
        layout: "/admin"
    },
    {
        path: "/subcategories/:id",
        component: Subcategory,
        layout: "/admin"
    },
    {
        path: "/subcategories",
        name: "Подкатегории",
        icon: "ni ni-bullet-list-67 text-yellow",
        component: Subcategories,
        layout: "/admin"
    },
    {
        path: "/localities/add",
        component: Locality,
        layout: "/admin"
    },
    {
        path: "/localities/:id",
        component: Locality,
        layout: "/admin"
    },
    {
        path: "/localities",
        name: "Локалитеты",
        icon: "ni ni-bullet-list-67 text-green",
        component: Localities,
        layout: "/admin"
    },
    {
        path: "/genes/add",
        component: Gene,
        layout: "/admin"
    },
    {
        path: "/genes/:id",
        component: Gene,
        layout: "/admin"
    },
    {
        path: "/genes",
        name: "Гены",
        icon: "ni ni-bullet-list-67 text-blue",
        component: Genes,
        layout: "/admin"
    },
    {
        path: "/traits/add",
        component: Trait,
        layout: "/admin"
    },
    {
        path: "/traits/:id",
        component: Trait,
        layout: "/admin"
    },
    {
        path: "/traits",
        name: "Виды генов",
        icon: "ni ni-bullet-list-67 text-gray",
        component: Traits,
        layout: "/admin"
    },
    {
        path: "/guard-levels/add",
        component: Level,
        layout: "/admin"
    },
    {
        path: "/guard-levels/:id",
        component: Level,
        layout: "/admin"
    },
    {
        path: "/guard-levels",
        name: "Уровни хранителей",
        icon: "ni ni-bullet-list-67 text-blue",
        component: Levels,
        layout: "/admin"
    },
    {
        path: "/breeder-levels/add",
        component: Level,
        layout: "/admin"
    },
    {
        path: "/breeder-levels/:id",
        component: Level,
        layout: "/admin"
    },
    {
        path: "/breeder-levels",
        name: "Уровни магазинов",
        icon: "ni ni-bullet-list-67 text-blue",
        component: Levels,
        layout: "/admin"
    },
    {
        path: "/user-profile",
        component: Profile,
        layout: "/admin"
    },
    {
        path: "/login",
        component: Login,
        layout: "/auth"
    },
];
export default routes;
