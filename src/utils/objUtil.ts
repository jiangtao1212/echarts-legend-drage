/*
 * @Author: jiangtao 1106950092@qq.com
 * @Date: 2024-08-19 15:13:37
 * @LastEditors: jiangtao 1106950092@qq.com
 * @LastEditTime: 2024-08-26 15:15:37
 * @FilePath: \vue-echarts-linkage\src\utils\objUtil.ts
 * @Description: 对象工具
 */

type AnyObject = { [key: string | symbol]: any };

// 深拷贝 -- 有函数的情况
const deepCopy = (obj: any, hash = new WeakMap()) => {
  if (Object(obj) !== obj) return obj; // 基本类型直接返回
  if (hash.has(obj)) return hash.get(obj); // 处理循环引用

  let result: AnyObject = Array.isArray(obj) ? [] : {} as { [key: string]: any };
  hash.set(obj, result);

  Reflect.ownKeys(obj).forEach(key => {
    if (typeof obj[key] === 'function') {
      // 复制函数
      result[key] = obj[key].bind(result);
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      // 递归复制对象或数组
      result[key] = deepCopy(obj[key], hash);
    } else {
      // 复制其他类型的值
      result[key] = obj[key];
    }
  });

  return result;
}

export default { deepCopy };