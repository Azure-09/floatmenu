const dbName = 'documentHTML';
const storeName = 'nodes';

/**
 * 打开数据库
 * @returns 
 */
function openDB() {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open(dbName, 2);
        request.onerror = (event) => reject(event.target.error);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, { autoIncrement: true });
            }
        }
        request.onsuccess = (event) => resolve(event.target.result);
    })
}

/**
 * 添加数据到数据库
 * @param {*} data 
 */
async function addData(data) {
    const db = await openDB();
    const transaction = db.transaction([storeName], 'readwrite');
    const objectStore = transaction.objectStore(storeName);

    const clearRequest = objectStore.clear();
    clearRequest.onsuccess = (event) => {
        let addRequest;
        data.forEach(node => {
            addRequest = objectStore.add(node);
        })

        addRequest.onsuccess = (event) => console.log('数据添加成功');
        addRequest.onerror = (event) => console.log('数据添加失败');

    }
    clearRequest.onerror = (event) => console.log('清除数据时出错:', event.target.error);
}

async function getData() {
    const db = await openDB();
    const transaction = db.transaction([storeName], 'readonly');
    const objectStore = transaction.objectStore(storeName);

    return new Promise((resolve, reject) => {
        const getRequest = objectStore.getAll();
        getRequest.onsuccess = (event) => {
            const data = event.target.result;
            resolve(data);
        }
        getRequest.onerror = (event) => {
            reject(event.target.error);
        }
    })
}

export { addData, getData };