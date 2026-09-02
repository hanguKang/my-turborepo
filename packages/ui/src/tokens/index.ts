import rawTokens from './tokens.json';

function extractValues(obj: any): any {
    if(obj === null || typeof obj !== 'object'){
        return obj; 
    }

    //피그마 토큰 특유의 {value: "...", type: "..."} 형태를 만나면 value만 반환
    if('value'in obj) {
        //만약 value 안에 또 typography 객체가 있다면 재귀 호출
        return typeof obj.value === 'object' ? extractValues(obj.value) : obj.value; 
    }

    const result : Record<string, any> = {};
    for (const [key, val] of Object.entries(obj)){
        //메타데이터($extensions, description 등)는 건너뜀
        if(key.startsWith('$') || key === 'descripts') continue;
        result[key] = extractValues(val);
    }

    return result; 
}

//토큰들 자동화 뽑기
export const theme = extractValues(rawTokens); 

//타입 자동생성
export type AppTheme = typeof theme;