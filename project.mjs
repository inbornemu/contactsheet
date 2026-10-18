import { field, column, pairFields, view, metric, item, csvArtifact, flattenPhotos, summary } from './lib/product-kit.mjs';
export const product = {
  category:'Photo production',projectNoun:'Photo collection',runLabel:'Analyze and group collection',
  outcome:'Upload a photo collection, inspect thumbnails, split false matches and record a per-image selection manifest.',
  fields:[field('photos','Source photos','photos',{help:'Up to 40 JPEG, PNG or WebP files, 6 MB of source files total. Originals are never deleted.'}),field('threshold','Similarity threshold (0–32)','number'),pairFields('splitPairs','Keep these image pairs in separate groups'),field('decisions','Selection decisions','dictionary',{keyLabel:'Image ID',valueLabel:'Decision',choices:['keep','omit-from-manifest','cover']})],
  describe(result) {
    const images=flattenPhotos(result);
    return summary([metric('Source images',result.sourceCount),metric('Decoded',result.analyzedCount),metric('Groups',result.groups.length),metric('Unreadable',result.failures.length)],[
      view('Selection manifest',[column('group','Group'),column('id','Image ID'),column('name','Filename'),column('width','Width'),column('height','Height'),column('decision','Selection')],images),
      view('Unreadable images',[column('id','Image ID'),column('name','Filename'),column('reason','Reason')],result.failures),
    ],[...images.map(p=>item(`image:${p.id}`,p.name,`Group ${p.group}; ${p.decision}`,p.decision==='undecided')),...result.groups.filter(g=>g.images.filter(p=>p.decision==='cover').length>1).map(g=>item(`cover:${g.id}`,`Multiple covers in group ${g.id}`,'Choose at most one cover image per group.',true)),...result.failures.map(p=>item(`failure:${p.id}`,`Unreadable: ${p.name}`,'Remove or replace the source image before release.',true))],{type:'photos',groups:result.groups});
  },
  artifacts(result) {
    return [csvArtifact('selection','Photo selection manifest',[column('group','Group'),column('id','Image ID'),column('name','Filename'),column('sha256','Source SHA256'),column('decision','Selection')],flattenPhotos(result))];
  },
};
