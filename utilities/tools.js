

export const splitAndRemoveFirst = (str) => {
    let parts = str.split('.');
    if (parts.length > 1) {
        parts.shift();
        return parts.join('.');
    }
    return str;
};

export const getHostCookieDomain = () => {
    let hostname = window.location.hostname;
    return splitAndRemoveFirst(hostname);
};

export const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const debounce = (callback, delay) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            callback.apply(null, args);
        }, delay);
    };
};

export const nestedObject = (object, nestedKey) => {
    let text = object[nestedKey];
    if (nestedKey.includes('.')) {
        const keys = nestedKey.split('.');
        let value = object;
        keys.forEach(key => {
            if (value[key]) {
                value = value[key];
            }
        });

        if (is.string(value)) {
            text = value;
        } else {
            text = '';
        }
    }

    return text;
}

export const storage = {
    get: (name) => {
        let item = undefined;
        try {
            item = localStorage.getItem(name);
            if (!is.string(item)) item = undefined;
        } catch (e) {
        }
        return item;
    },
    set: (name, value) => localStorage.setItem(name, value),
    delete: (name) => localStorage.removeItem(name),
};

export const base64 = {
    encode: (data) => Buffer.from(data).toString('base64'),
    decode: (data) => Buffer.from(data, 'base64').toString('ascii'),
};

export const is = {
    file: (file) => {
        return file instanceof File;
    },
    blob: (blob) => {
        return blob instanceof Blob;
    },
    url: (str) => {
        if (typeof str === 'string' && str != null) {
            let exp = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&/=]*)/g;
            let res = str.match(exp);
            return res !== null;
        }
        return false;
    },
    base64: (str) => {
        return str.search(';base64,') > 0;
    },
    phone: (str) => {
        if (typeof str === 'string' && str != null) {
            let exp = /^[+]?([0-9]{1,3})?([\s-]?)?([0-9]{10})$/;
            let res = str.match(exp);
            return res !== null;
        }
        return false;
    },
    email: (str) => {
        if (typeof str === 'string' && str != null) {
            let exp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            let res = str.match(exp);
            return res !== null;
        }
        return false;
    },
    object: (object) => {
        if (typeof object === 'object' && object != null) {
            if (Object.keys(object).length > 0) return true;
        }
        return false;
    },
    array: (array) => {
        if (typeof array === 'object' && array != null && array.length > 0) return true;
        return false;
    },
    undefined: (elem) => {
        return typeof elem === 'undefined';
    },
    function: (fn) => {
        return typeof fn === 'function';
    },
    string: (str) => {
        return typeof str === 'string';
    },
    number: (str) => {
        return typeof str === 'number';
    },
    empty: (str) => {
        if (typeof str === 'string' && str.trim() == '') return true;
        return false;
    },
    mobile: () => {
        return navigator?.userAgent && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
};

export const to = {
    pad: (value, padNumber, padString = '0') => value.toString().padStart(padNumber, padString),
    date: (date) => {
        let day = to.pad(date.getDate(), 2);
        let month = to.pad(date.getMonth() + 1, 2);
        let year = date.getFullYear();
        return `${year}-${month}-${day}`;
    },
    number: (num) => {
        if (is.undefined(num)) return 0;
        num = num * 1;
        if (is.undefined(num)) return 0;
        return num;
    },
    string: (str) => {
        if (!is.string(str)) return '';
        return str;
    },
    boolean: (str) => {
        return parseInt(str) === 1 ? true : false;
    },
    removeAccents: (str) => {
        if (typeof str === 'string' || str instanceof String) {
            return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        }
        return str;
    },
    currency: (number) => {
        number = parseFloat(number);
        if (isNaN(number)) number = 0;
        let formatter = new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
        });
        return formatter.format(number);
    },
    numberFormat: (number) => {
        if (isNaN(number)) number = 0;
        return number.toLocaleString('es-MX');
    },
    stringData: (date) => {
        const formatDate = new Date(date).toLocaleString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hour12: false, minute: '2-digit', second: '2-digit' })
        return formatDate
    },
    formatDateTime: (date) => {
        if (typeof date == 'string') {
            //2023-07-17T17:00:00
            //2023-07-17 a las 05:00 PM
            let year = date.substring(0, 4);
            let month = date.substring(5, 7);
            let day = date.substring(8, 10);
            let hour = date.substring(11, 13);
            let minute = date.substring(14, 16);
            let period = parseInt(hour) >= 12 ? 'PM' : 'AM';
            return `${year}-${month}-${day} a las ${hour}:${minute} ${period}`;
        }
        return '';
    },
    pesos: (cant)=>{
        if (isNaN(cant)) return '$0.00'; // Manejar valores no numéricos

        // Convertir el número a flotante por seguridad
        const numeroFloat = parseFloat(cant);

        // Usar toLocaleString para formatear correctamente como pesos mexicanos
        return numeroFloat.toLocaleString('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 2, // Asegura siempre 2 decimales
            maximumFractionDigits: 2,
        });
    }
};

export const get = {
    path: (_pathname) => {
        let _path = _pathname?.split('/');
        if (!is.undefined(_path?.[1])) _path = `/${_path[1]}`;
        return _path;
    },
    days: (start, end) => {
        let date1 = new Date(start);
        let date2 = new Date(end);
        let oneDay = 1000 * 60 * 60 * 24;
        let diffInTime = date2.getTime() - date1.getTime();
        return Math.round(diffInTime / oneDay);
    }
};

export const input = {
    value: {
        set: (id, value) => {
            if (document.getElementById(id)) {
                let elem = document.getElementById(id);
                if (!is.string(value)) value = '';
                elem.value = value;
            }
        },
        get: (id, defaultValue = '') => {
            if (document.getElementById(id)) {
                let elem = document.getElementById(id);
                let val = elem.value;
                if (!is.string(val)) val = '';
                val = val.trim();
                if (val == '' && defaultValue != '') val = defaultValue;
                return val.trim();
            }
            return '';
        },
    },
    checked: (id) => {
        if (document.getElementById(id)) {
            let elem = document.getElementById(id);
            let val = elem.checked;
            return val;
        }
        return false;
    },
    focus: (id) => {
        setTimeout(() => {
            if (document.getElementById(id)) {
                document.getElementById(id).focus();
            }
        }, 30);
    },
    blur: (id) => {
        if (document.getElementById(id) && !is.mobile()) {
            document.getElementById(id).blur();
        }
    },
    src: (id, src) => {
        if (document.getElementById(id)) document.getElementById(id).setAttribute('src', src);
    },
    error: (id, error) => {
        if (document.getElementById(id)) {
            let elem = document.getElementById(id);
            elem.innerHTML = error;
        }
    },
    innerHTML: (id, text) => {
        if (document.getElementById(id)) {
            let elem = document.getElementById(id);
            elem.innerHTML = text;
        }
    },
    appendHTML: (id, text) => {
        if (document.getElementById(id)) {
            let elem = document.getElementById(id);
            elem.innerHTML += text;
        }
    },
};

export const cookie = {
    set: (name, value) => {
        let expires = '';
        let days = 360;
        let domain = getHostCookieDomain();
        let date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = '; expires=' + date.toUTCString();
        Cookies.set(name, value, { expires: date, domain: domain });
    },
    get: (name) => Cookies.get(name),
    delete: (name) => Cookies.remove(name, { path: '', domain: getHostCookieDomain() }),
};
