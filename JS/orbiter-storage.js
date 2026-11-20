const ORBITER_KEYS = {
    PRODUCTS: 'orbiter_productos_v1',
    CART: 'orbiter_carrito_v1',
    ORDERS: 'orbiter_compras_v1'
};

const PRODUCT_IMAGES = {
    default: '../SOURCES/productos/producto-default.png',
    audicularesTws: '../SOURCES/productos/audiculares-tws.png',
    tenisMiuMiu: '../SOURCES/productos/tenis-miu-miu.png',
    audifonosKz: '../SOURCES/productos/audifonos-kz.png',
    taconesMaryJane: '../SOURCES/productos/tacones-mary-jane.png',
    audifonosCableAu47: '../SOURCES/productos/audifonos-cable-au47.png',
    audifonosSport: '../SOURCES/productos/audifonos-sport.png',
    lentesSolares: '../SOURCES/productos/lentes-solares.png'
};

const DEFAULT_PRODUCTS = [
    {
        id: 1,
        nombre: 'Audiculares TWS STF',
        sku: 'SKU-0001',
        categoria: 'Audio',
        precio: 400.00,
        stock: 24,
        imagen: PRODUCT_IMAGES.audicularesTws,
        descripcion: 'Audífonos inalámbricos TWS compactos con estuche de carga.'
    },
    {
        id: 2,
        nombre: 'Tenis Miu Miu Tyre Sports',
        sku: 'SKU-0002',
        categoria: 'Calzado',
        precio: 4700.00,
        stock: 8,
        imagen: PRODUCT_IMAGES.tenisMiuMiu,
        descripcion: 'Tenis deportivos de diseño urbano con suela tipo neumático.'
    },
    {
        id: 3,
        nombre: 'Audífonos in-ear gamer KZ',
        sku: 'SKU-0003',
        categoria: 'Audio',
        precio: 1500.00,
        stock: 0,
        imagen: PRODUCT_IMAGES.audifonosKz,
        descripcion: 'Monitores in-ear de alta fidelidad para gaming y audio detallado.'
    },
    {
        id: 4,
        nombre: 'Tacones mary jane de charol',
        sku: 'SKU-0004',
        categoria: 'Calzado',
        precio: 4300.00,
        stock: 29,
        imagen: PRODUCT_IMAGES.taconesMaryJane,
        descripcion: 'Zapatillas de charol estilo Mary Jane con acabado brillante.'
    },
    {
        id: 5,
        nombre: 'Audifonos con Cable CE-AU47',
        sku: 'SKU-0005',
        categoria: 'Audio',
        precio: 80.00,
        stock: 31,
        imagen: PRODUCT_IMAGES.audifonosCableAu47,
        descripcion: 'Audífonos alámbricos ligeros de uso diario.'
    }
];

const DEFAULT_CART = [
    {
        id: 2,
        nombre: 'Tenis Miu Miu Tyre Sports',
        categoria: 'CALZADO',
        precioUnitario: 4700.00,
        cantidad: 1,
        stock: 8,
        imagen: PRODUCT_IMAGES.tenisMiuMiu
    },
    {
        id: 4,
        nombre: 'Tacones mary jane de charol',
        categoria: 'CALZADO',
        precioUnitario: 4300.00,
        cantidad: 1,
        stock: 29,
        imagen: PRODUCT_IMAGES.taconesMaryJane
    }
];

function getProductImage(prod) {
    if (prod && prod.imagen && String(prod.imagen).trim() !== '') {
        return prod.imagen;
    }
    return PRODUCT_IMAGES.default;
}

function getProducts() {
    const raw = localStorage.getItem(ORBITER_KEYS.PRODUCTS);
    if (!raw) {
        const clone = JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
        saveProducts(clone);
        return clone;
    }
    try {
        const parsed = JSON.parse(raw);
        return parsed.map(item => ({
            ...item,
            imagen: getProductImage(item)
        }));
    } catch {
        const clone = JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
        saveProducts(clone);
        return clone;
    }
}

function saveProducts(products) {
    localStorage.setItem(ORBITER_KEYS.PRODUCTS, JSON.stringify(products));
}

function getCart() {
    const raw = localStorage.getItem(ORBITER_KEYS.CART);
    if (!raw) {
        const clone = JSON.parse(JSON.stringify(DEFAULT_CART));
        saveCart(clone);
        return clone;
    }
    try {
        const parsed = JSON.parse(raw);
        const products = getProducts();
        return parsed.map(item => {
            const matchedProd = products.find(p => p.id === item.id);
            return {
                ...item,
                imagen: getProductImage(matchedProd || item)
            };
        });
    } catch {
        const clone = JSON.parse(JSON.stringify(DEFAULT_CART));
        saveCart(clone);
        return clone;
    }
}

function saveCart(cart) {
    localStorage.setItem(ORBITER_KEYS.CART, JSON.stringify(cart));
}

function getOrders() {
    const raw = localStorage.getItem(ORBITER_KEYS.ORDERS);
    if (!raw) return [];
    try {
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

function saveOrders(orders) {
    localStorage.setItem(ORBITER_KEYS.ORDERS, JSON.stringify(orders));
}

function resetDemoData() {
    localStorage.setItem(ORBITER_KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
    localStorage.setItem(ORBITER_KEYS.CART, JSON.stringify(DEFAULT_CART));
    localStorage.removeItem(ORBITER_KEYS.ORDERS);
}

function getStockBadgeHTML(stock) {
    const qty = Number(stock);
    if (qty <= 0) {
        return '<span class="status-badge status-out">• Agotado</span>';
    }
    if (qty <= 10) {
        return `<span class="status-badge status-low">• ${qty} restantes</span>`;
    }
    return '<span class="status-badge status-available">• Disponible</span>';
}