from pathlib import Path
from PIL import Image
import subprocess,json
import numpy as np
video='/Users/lksraw/Documents/CORDEIRO GROUP/casa-noite_2K_upscaled.mp4'
raw=subprocess.check_output(['ffmpeg','-v','error','-i',video,'-vf','scale=96:54:flags=area','-fps_mode','passthrough','-f','rawvideo','-pix_fmt','rgb24','pipe:1'])
source=np.frombuffer(raw,dtype=np.uint8).reshape(-1,54,96,3).astype(np.float32).reshape(-1,96*54*3)
paths=[Path('public/images/ezgif')/f'ezgif-frame-{i:03d}.jpg' for i in range(14,241)]
target=np.stack([np.asarray(Image.open(p).convert('RGB').resize((96,54),Image.Resampling.BOX),dtype=np.float32).ravel() for p in paths])
distance=np.maximum(0,(target*target).sum(axis=1)[:,None]+(source*source).sum(axis=1)[None,:]-2*target@source.T)/target.shape[1]
matches=distance.argmin(axis=1)
report=[{'output_frame':i+14,'source_index':int(n),'mse':round(float(distance[i,n]),3)} for i,n in enumerate(matches)]
Path('output/hero-upscale/frame-matches-nearest.json').write_text(json.dumps(report,indent=2)+'\n')
np.save('output/hero-upscale/frame-distances.npy',distance)
print('Video frame count:',len(source))
print('Nearest matches:',json.dumps(report[:12]+report[100:108]+report[-12:],indent=2))
print('Backward transitions:',int((np.diff(matches)<0).sum()))
print('Source range:',int(matches.min()),int(matches.max()))
print('Median match error:',float(np.median(distance.min(axis=1))))
for ratio in [1,.5,2]:
 candidate=np.minimum(len(source)-1,np.round((np.arange(14,241)-1)*ratio).astype(int))
 print('ratio',ratio,'median error',float(np.median(distance[np.arange(227),candidate])))
