const initialState = {
    profile: {
        name: ''
    },
    header: {
        newUsers: {
            mount: 0,
            total: 0,
            request: true
        },
        newProducts: {
            mount: 0,
            total: 0,
            request: true
        }
    },
    kind: {
        request: true,
        title_eng: '',
        title_rus: '',
        group: '',
        logo_square: null,
        logo_header: null,
        has_subcategories: 0,
        subcategories: [],
        localities: []
    },
    kinds: {
        request: true,
        all: [],
        active: [],
    },
    subcategory: {
        request: true,
        title: '',
        kinds: [],
        localities: []
    },
    subcategories: {
        request: true,
        all: []
    },
    locality: {
        request: true,
        title: '',
        kinds: [],
        subcategories: []

    },
    localities: {
        request: true,
        all: []
    },
    gene: {
        request: true,
        title: '',
        type: 'recessive',
        kinds: []
    },
    genes: {
        request: true,
        current_page: null,
        last_page: null,
        data: [],
        options: {
            q: ''
        }
    },
    trait: {
        request: true,
        title: '',
        type: 'recessive'
    },
    traits: {
        request: true,
        current_page: null,
        last_page: null,
        data: []
    },
    faq: {
        request: true,
        label: '',
        title: '',
        description: '',
        in_index: false
    },
    faqs: {
        request: true,
        data: []
    },
    product: {
        request: true,
        morphs: [],
        locality: null,
        product_images: [],
        searchMorphsResult: [],
        selectedMorphIdx: 0,
        age: {
            title: ''
        },
        subcategory: {
            title: ''
        },
        user: {
            company_name: ''
        },
        kind: {
            title_rus: '',
            title_eng: ''
        },
        initialMorphs: [],
        initialLocalities: []
    },
    products: {
        products: {
            data: [],
            current_page: null,
            last_page: null
        },
        options: {
            kind: '',
            q: ''
        },
        productsRequest: false
    },
    report: {
        request: true,
        title: '',
        description: ''
    },
    reports: {
        request: true,
        current_page: null,
        last_page: null,
        data: []
    },
    user: {
        request: true,
        name: '',
        surname: '',
        patronymic: '',
        email: '',
        phone: '',
        company_name: '',
        owner: '',
        policity: '',
        description: '',
        website: '',
        vk: '',
        facebook: '',
        instagram: '',
        youtube: '',
        profile_img: null,
        logo_img_url: null,
        local_delivery: false,
        regional_delivery: false,
        countrywide_delivery: false,
        is_breeder: false,
        is_guard: false,
        active: false,
        guardians_kinds: [],
        initialGuardiansKinds: [],
        products: []
    },
    users: {
        data: [],
        last_page: null,
        current_page: null,
        sortTitle: 'Все пользователи',
        options: {
            sort: '',
            q: ''
        },
        request: true
    },
    divorce: {
        request: true,
        kind: {
            title_rus: '',
            title_eng: ''
        },
        user: {
            company_name: ''
        },
        male: [],
        female: [],
        searchMorphsMaleResult: [],
        searchMorphsFemaleResult: [],
        selectedMorphMaleIdx: 0,
        selectedMorphFemaleIdx: 0
    },
    divorces: {
        data: [],
        current_page: null,
        last_page: null,
        options: {
            kind: '',
            q: ''
        },
        divorcesRequest: false
    },
    level: {
        request: true,
        level: 1,
        title: '',
        logo_src: ''
    },
    levels: {
        data: [],
        current_page: null,
        last_page: null,
        request: true
    },
};

export default initialState;