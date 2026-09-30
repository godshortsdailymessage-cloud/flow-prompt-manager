// Finds the Flow prompts in the text of a PDF.
export function extractPrompts(raw){
  raw = raw.replace(/\r/g,'').replace(/\f/g,' ').replace(/\u00a0/g,' ');
  let re = /FLOW\s+PROMPT\s*[—–-]\s*paste\s+this(?:\s*\(\s*[^)]{1,30}\))?/ig;
  let hits = [...raw.matchAll(re)];
  if(!hits.length){
    re = /FLOW\s+PROMPT\s*[:\-]\s*/ig;
    hits = [...raw.matchAll(re)];
  }
  const out = [];
  for(let i=0;i<hits.length;i++){
    const s = hits[i].index + hits[i][0].length;
    const e = i+1<hits.length ? hits[i+1].index : raw.length;
    const b = cleanPrompt(raw.slice(s,e));
    if(b) out.push({number: out.length+1, prompt: b});
  }
  return out;
}

function cleanPrompt(body){
  let t = body.replace(/\s+/g,' ').trim().replace(/^[:\-–—]\s*/,'');
  // Stop where the next scene starts ("2 NARRATION — 14 words ...")
  const cut = t.search(/\s+(?:\d{1,4}\s+)?NARRATION\s*[—–-]/i);
  if(cut >= 0) t = t.slice(0,cut);
  // Remove the scene number left at the end. PDFs sometimes split it ("10 0" for 100).
  t = t.replace(/(?<=[.!?"”)…]|SECTION)(?:\s+\d{1,4})+$/i,'');
  // Remove a section title page that sits between two scenes ("02 Title SECTION")
  if(/\sSECTION$/i.test(t)){
    const nums = [...t.matchAll(/\s\d{2}\s/g)];
    const last = nums.length ? nums[nums.length-1] : null;
    if(last && t.length - last.index < 220) t = t.slice(0,last.index);
  }
  return t.trim();
}
