import {moduleStore} from './../store';
export default function systemTags() {
    let savedSystags = [];
    let id = 0;

    const systags_replacer = (text) => {
        savedSystags[id++] = text;
        return '';
    }

    const mdsv_parser = (text) => {
        if(!text.match(/^[\t ]*<script[\S\s]*?>[\S\s]*?<\/script>/gmi)){
            
            const re = /^[\s]*(import .+ from .+)[\s]*$/gmi
            const imports = [];
            let res;
            while(res = re.exec(text)) imports.push(res[1]);

            if(imports.length > 0) {
                text = text.replace(re,'');
                imports.forEach( imp => {
                    moduleStore.add(imp);
                });
            }

        }
        return text;
    }

    const before = (text,processor) => {
       
        text = mdsv_parser(text);
        const re = /^[\s]*<(?:script|style)[^>]*>[\S\s]*?<\/.+>[\s]*$/gmi
        text = text.replace(re,systags_replacer);
    
        return text;
    }

    const after = (text,processor) => {
        return savedSystags.length > 0 ? text + "\n\n" + savedSystags.join("\n\n") : text;
    }
    
    return {before,after}
}