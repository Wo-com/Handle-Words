// import localforage from "localforage";
import { SAVE_DICT_KEY, SAVE_SETTING_KEY } from "@/utils/const.js";
import { DefaultBaseState } from "@/stores/base";
// import { DefaultSettingState } from "@/stores/setting.js";
import { cloneDeep } from "lodash-es";

export function getRandom(a, b) {
    return Math.random() * (b - a) + a;
}

export function no() {
    ElMessage.warning('未实现');
}

//读取词典数据
export function checkAndUpgradeSaveDict(val) {
    if (val) {
        try {
            let data;
            if (typeof val === 'string') {
                data = JSON.parse(val);
            } else {
                data = val;
            }
            let state = data.val;
            if (typeof state !== 'object') {
                return {};
            }
            if (!data.version) {
                return {};
            }
  
            let version = Number(data.version);
            let defaultBaseState = DefaultBaseState();
            if (version === SAVE_DICT_KEY.version) {
                for (const [key, value] of Object.entries(defaultBaseState)) {
                    if (state[key] !== undefined) {
                        defaultBaseState[key] = state[key];
                    }
                }
                return defaultBaseState;
            } else {
                // 版本不匹配时，使用 Object.assign 进行浅拷贝合并，提高性能
                Object.assign(defaultBaseState, state);
                return defaultBaseState;
            }
        } catch (e) {
            return {};
        }
    }
    return {};
}



