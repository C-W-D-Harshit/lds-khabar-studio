import fs from 'node:fs';
import {geoMercator, geoPath, geoArea} from 'd3-geo';
const rewind=(f)=>{const g=f.geometry; const polys=g.type==='Polygon'?[g.coordinates]:g.type==='MultiPolygon'?g.coordinates:[]; for(const poly of polys){ for(let i=0;i<poly.length;i++){ const test={type:'Polygon',coordinates:[poly[i]]}; const a=geoArea(test); const wantSmall = i===0; if((a>2*Math.PI)===wantSmall) poly[i].reverse(); } } return f;};
import * as topo from 'topojson-client';
const states = JSON.parse(fs.readFileSync('scripts/geodata/states.json','utf8'));
const world = JSON.parse(fs.readFileSync('node_modules/world-atlas/countries-50m.json','utf8'));
const districts = JSON.parse(fs.readFileSync('scripts/geodata/districts.json','utf8'));
const countries = topo.feature(world, world.objects.countries).features;
const W=1920,H=1080;
const views = {
  east: {bbox:[[76.5,10.5],[93.5,24.5]], w:1100,h:760, states:['Odisha','Andhra Pradesh','Telangana','Chhattisgarh','West Bengal','Jharkhand','Tamil Nadu','Karnataka','Maharashtra','Madhya Pradesh','Bihar','Kerala','Goa'], countries:['Bangladesh','Myanmar','Sri Lanka'], district:'Ganjam',
    pins:{gopalpur:[84.86,19.26],puri:[85.83,19.81],bhubaneswar:[85.82,20.30],visakhapatnam:[83.22,17.69]},
    track:[[90.5,10.8],[89.6,12.6],[88.6,14.4],[87.6,16.2],[86.5,17.8],[85.5,18.8],[84.86,19.26],[84.2,19.9],[83.6,20.6]]},
  up: {bbox:[[76.8,23.6],[84.8,30.6]], w:900,h:740, states:['Uttar Pradesh','Uttarakhand','Haryana','Delhi','Rajasthan','Madhya Pradesh','Bihar'], countries:[], district:'Bulandshahr', pins:{bulandshahr:[77.85,28.40],delhi:[77.21,28.61],noida:[77.39,28.54]}},
  uk: {bbox:[[77.4,28.6],[81.2,31.6]], w:900,h:740, states:['Uttarakhand','Uttar Pradesh','Himachal Pradesh','Haryana'], countries:[], district:'Pauri Garhwal', pins:{panchur:[78.53,29.98],haridwar:[78.16,29.95],dehradun:[78.03,30.32]}},
  raj: {bbox:[[69,23],[79,30.5]], w:900,h:740, states:['Rajasthan','Gujarat','Madhya Pradesh','Uttar Pradesh','Haryana','Punjab','Delhi'], countries:[], district:'Jaipur', pins:{jaipur:[75.79,26.91]}},
};
const out={};
for (const [k,v] of Object.entries(views)) {
  const fc={type:'FeatureCollection',features:[{type:'Feature',geometry:{type:'MultiPoint',coordinates:v.bbox}}]};
  const proj=geoMercator().fitSize([v.w,v.h],fc);
  const path=geoPath(proj);
  const r=(n)=>Math.round(n*10)/10;
  const simp=(d)=>d? d.replace(/-?\d+\.\d+/g,(m)=>String(r(+m))):'';
  out[k]={w:v.w,h:v.h,
    states: states.features.filter(f=>v.states.includes(f.properties.st_nm)).map(rewind).map(f=>({name:f.properties.st_nm,d:simp(path(f)),c:path.centroid(f).map(r)})),
    countries: countries.filter(f=>v.countries.includes(f.properties.name)).map(rewind).map(f=>({name:f.properties.name,d:simp(path(f))})),
    district: districts.features.filter(f=>f.properties.district===v.district).map(rewind).map(f=>({name:f.properties.district,d:simp(path(f)),c:path.centroid(f).map(r)}))[0]||null,
    pins:Object.fromEntries(Object.entries(v.pins).map(([n,c])=>[n,proj(c).map(r)])),
    track:(v.track||[]).map(c=>proj(c).map(r)),
  };
}
fs.writeFileSync('src/data/geo.json',JSON.stringify(out));
for (const [k,v] of Object.entries(out)) console.log(k, v.states.map(s=>s.name+':'+s.d.length).join(' '), v.countries.map(s=>s.name+':'+s.d.length).join(' '), JSON.stringify(v.pins));
