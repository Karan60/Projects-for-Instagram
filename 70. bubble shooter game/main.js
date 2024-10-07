/*
  to do
  ✔ green pieces -> greener
  ✔ score
  ✔ falling pieces @ detached
  ✔ screen blinks before row-advance
  ✔ powerups/exploding-pieces
  * load-piece animation
  * multiplayer (?)
*/
c = document.querySelector('#c')
c.width = 1920
c.height = 1080
x = c.getContext('2d')
C = Math.cos
S = Math.sin
t = 0
T = Math.tan

rsz = window.onresize = () =>{
  let b = document.body
  let margin = 10
  let n
  let d = .5625
  if(b.clientHeight/b.clientWidth > d){
    c.style.width = `${(n=b.clientWidth) - margin*2}px`
    c.style.height = `${n*d - margin*2}px`
  }else{
    c.style.height = `${(n=b.clientHeight) - margin*2}px`
    c.style.width = `${n/d - margin*2}px`
  }
}

rsz()

async function Draw(){
  if(!t){
    oX = oY = oZ = 0
    Rn = Math.random
    R = (Rl,Pt,Yw,m) => {
      let p
      M = Math
      A = M.atan2
      H = M.hypot
      X = S(p=A(X,Z)+Yw) * (d=H(X,Z))
      Z = C(p)*d
      X = S(p=A(X,Y)+Rl) * (d=H(X,Y))
      Y = C(p) * d
      Y = S(p=A(Y,Z)+Pt) * (d=H(Y,Z))
      Z = C(p)*d
      if(m){
        X+=oX
        Y+=oY
        Z+=oZ
      }
    }
    
    R2=(Rl,Pt,Yw,m=false)=>{
      M=Math
      A=M.atan2
      H=M.hypot
      if(m){
        X-=oX
        Y-=oY
        Z-=oZ
      }
      X=S(p=A(X,Y)+Rl)*(d=H(X,Y))
      Y=C(p)*d
      Y=S(p=A(Y,Z)+Pt)*(d=H(Y,Z))
      Z=C(p)*d
      X=S(p=A(X,Z)+Yw)*(d=H(X,Z))
      Z=C(p)*d
    }

    Q = () => [c.width/2+X/Z*700, c.height/2+Y/Z*700]
    I=(A,B,M,D,E,F,G,H)=>(K=((G-E)*(B-F)-(H-F)*(A-E))/(J=(H-F)*(M-A)-(G-E)*(D-B)))>=0&&K<=1&&(L=((M-A)*(B-F)-(D-B)*(A-E))/J)>=0&&L<=1?[A+K*(M-A),B+K*(D-B)]:0
    
    Normal = (facet, autoFlipNormals=false, X1=0, Y1=0, Z1=0) => {
      let ax = 0, ay = 0, az = 0
      facet.map(q_=>{ ax += q_[0], ay += q_[1], az += q_[2] })
      ax /= facet.length, ay /= facet.length, az /= facet.length
      let b1 = facet[2][0]-facet[1][0], b2 = facet[2][1]-facet[1][1], b3 = facet[2][2]-facet[1][2]
      let c1 = facet[1][0]-facet[0][0], c2 = facet[1][1]-facet[0][1], c3 = facet[1][2]-facet[0][2]
      crs = [b2*c3-b3*c2,b3*c1-b1*c3,b1*c2-b2*c1]
      d = Math.hypot(...crs)+.001
      let nls = 1 //normal line length
      crs = crs.map(q=>q/d*nls)
      let X1_ = ax, Y1_ = ay, Z1_ = az
      let flip = 1
      if(autoFlipNormals){
        let d1_ = Math.hypot(X1_-X1,Y1_-Y1,Z1_-Z1)
        let d2_ = Math.hypot(X1-(ax + crs[0]/99),Y1-(ay + crs[1]/99),Z1-(az + crs[2]/99))
        flip = d2_>d1_?-1:1
      }
      let X2_ = ax + (crs[0]*=flip), Y2_ = ay + (crs[1]*=flip), Z2_ = az + (crs[2]*=flip)
      return [X1_, Y1_, Z1_, X2_, Y2_, Z2_]
    }
      
    async function loadOBJ(url, scale, tx, ty, tz, rl, pt, yw, recenter=true) {
      let res
      await fetch(url, res => res).then(data=>data.text()).then(data=>{
        a=[]
        data.split("\nv ").map(v=>{
          a=[...a, v.split("\n")[0]]
        })
        a=a.filter((v,i)=>i).map(v=>[...v.split(' ').map(n=>(+n.replace("\n", '')))])
        ax=ay=az=0
        a.map(v=>{
          v[1]*=-1
          if(recenter){
            ax+=v[0]
            ay+=v[1]
            az+=v[2]
          }
        })
        ax/=a.length
        ay/=a.length
        az/=a.length
        a.map(v=>{
          X=(v[0]-ax)*scale
          Y=(v[1]-ay)*scale
          Z=(v[2]-az)*scale
          R2(rl,pt,yw,0)
          v[0]=X
          v[1]=Y * (url.indexOf('bug')!=-1?2:1)
          v[2]=Z
        })
        maxY=-6e6
        a.map(v=>{
          if(v[1]>maxY)maxY=v[1]
        })
        a.map(v=>{
          v[1]-=maxY-oY
          v[0]+=tx
          v[1]+=ty
          v[2]+=tz
        })

        b=[]
        data.split("\nf ").map(v=>{
          b=[...b, v.split("\n")[0]]
        })
        b.shift()
        b=b.map(v=>v.split(' '))
        b=b.map(v=>{
          v=v.map(q=>{
            return +q.split('/')[0]
          })
          v=v.filter(q=>q)
          return v
        })

        res=[]
        b.map(v=>{
          e=[]
          v.map(q=>{
            e=[...e, a[q-1]]
          })
          e = e.filter(q=>q)
          res=[...res, e]
        })
      })
      return res
    }

    reflect = (a, n) => {
      let d1 = Math.hypot(...a)+.0001
      let d2 = Math.hypot(...n)+.0001
      a[0]/=d1
      a[1]/=d1
      a[2]/=d1
      n[0]/=d2
      n[1]/=d2
      n[2]/=d2
      let dot = -a[0]*n[0] + -a[1]*n[1] + -a[2]*n[2]
      let rx = -a[0] - 2 * n[0] * dot
      let ry = -a[1] - 2 * n[1] * dot
      let rz = -a[2] - 2 * n[2] * dot
      return [-rx*d1, -ry*d1, -rz*d1]
    }

    geoSphere = (mx, my, mz, iBc, size) => {
      let collapse=0
      let B=Array(iBc).fill().map(v=>{
        X = Rn()-.5
        Y = Rn()-.5
        Z = Rn()-.5
        return  [X,Y,Z]
      })
      for(let m=99;m--;){
        B.map((v,i)=>{
          X = v[0]
          Y = v[1]
          Z = v[2]
          B.map((q,j)=>{
            if(j!=i){
              X2=q[0]
              Y2=q[1]
              Z2=q[2]
              d=1+(Math.hypot(X-X2,Y-Y2,Z-Z2)*(3+iBc/40)*3)**4
              X+=(X-X2)*99/d
              Y+=(Y-Y2)*99/d
              Z+=(Z-Z2)*99/d
            }
          })
          d=Math.hypot(X,Y,Z)
          v[0]=X/d
          v[1]=Y/d
          v[2]=Z/d
          if(collapse){
            d=25+Math.hypot(X,Y,Z)
            v[0]=(X-X/d)/1.1
            v[1]=(Y-Y/d)/1.1         
            v[2]=(Z-Z/d)/1.1
          }
        })
      }
      mind = 6e6
      B.map((v,i)=>{
        X1 = v[0]
        Y1 = v[1]
        Z1 = v[2]
        B.map((q,j)=>{
          X2 = q[0]
          Y2 = q[1]
          Z2 = q[2]
          if(i!=j){
            d = Math.hypot(a=X1-X2, b=Y1-Y2, e=Z1-Z2)
            if(d<mind) mind = d
          }
        })
      })
      a = []
      B.map((v,i)=>{
        X1 = v[0]
        Y1 = v[1]
        Z1 = v[2]
        B.map((q,j)=>{
          X2 = q[0]
          Y2 = q[1]
          Z2 = q[2]
          if(i!=j){
            d = Math.hypot(X1-X2, Y1-Y2, Z1-Z2)
            if(d<mind*2){
              if(!a.filter(q=>q[0]==X2&&q[1]==Y2&&q[2]==Z2&&q[3]==X1&&q[4]==Y1&&q[5]==Z1).length) a = [...a, [X1*size,Y1*size,Z1*size,X2*size,Y2*size,Z2*size]]
            }
          }
        })
      })
      B.map(v=>{
        v[0]*=size
        v[1]*=size
        v[2]*=size
        v[0]+=mx
        v[1]+=my
        v[2]+=mz
      })
      return [mx, my, mz, size, B, a]
    }

    burst = new Image()
    burst.src = "https://srmcgann.github.io/temp/burst.png"

    starsLoaded = false, starImgs = [{loaded: false}]
    starImgs = Array(9).fill().map((v,i) => {
      let a = {img: new Image(), loaded: false}
      a.img.onload = () => {
        a.loaded = true
        setTimeout(()=>{
          if(starImgs.filter(v=>v.loaded).length == 9) starsLoaded = true
        }, 0)
      }
      a.img.src = `https://srmcgann.github.io/stars/star${i+1}.png`
      return a
    })

    lineFaceI = (X1, Y1, Z1, X2, Y2, Z2, facet, autoFlipNormals=false, showNormals=false) => {
      let X_, Y_, Z_, d, m, l_,K,J,L,p
      let I_=(A,B,M,D,E,F,G,H)=>(K=((G-E)*(B-F)-(H-F)*(A-E))/(J=(H-F)*(M-A)-(G-E)*(D-B)))>=0&&K<=1&&(L=((M-A)*(B-F)-(D-B)*(A-E))/J)>=0&&L<=1?[A+K*(M-A),B+K*(D-B)]:0
      let Q_=()=>[c.width/2+X_/Z_*900,c.height/2+Y_/Z_*900]
      let R_ = (Rl,Pt,Yw,m)=>{
        let M=Math, A=M.atan2, H=M.hypot
        X_=S(p=A(X_,Y_)+Rl)*(d=H(X_,Y_)),Y_=C(p)*d,X_=S(p=A(X_,Z_)+Yw)*(d=H(X_,Z_)),Z_=C(p)*d,Y_=S(p=A(Y_,Z_)+Pt)*(d=H(Y_,Z_)),Z_=C(p)*d
        if(m){ X_+=oX,Y_+=oY,Z_+=oZ }
      }
      let rotSwitch = m =>{
        switch(m){
          case 0: R_(0,0,Math.PI/2); break
          case 1: R_(0,Math.PI/2,0); break
          case 2: R_(Math.PI/2,0,Math.PI/2); break
        }        
      }
      let ax = 0, ay = 0, az = 0
      facet.map(q_=>{ ax += q_[0], ay += q_[1], az += q_[2] })
      ax /= facet.length, ay /= facet.length, az /= facet.length
      let b1 = facet[2][0]-facet[1][0], b2 = facet[2][1]-facet[1][1], b3 = facet[2][2]-facet[1][2]
      let c1 = facet[1][0]-facet[0][0], c2 = facet[1][1]-facet[0][1], c3 = facet[1][2]-facet[0][2]
      let crs = [b2*c3-b3*c2,b3*c1-b1*c3,b1*c2-b2*c1]
      d = Math.hypot(...crs)+.001
      let nls = 1 //normal line length
      crs = crs.map(q=>q/d*nls)
      let X1_ = ax, Y1_ = ay, Z1_ = az
      let flip = 1
      if(autoFlipNormals){
        let d1_ = Math.hypot(X1_-X1,Y1_-Y1,Z1_-Z1)
        let d2_ = Math.hypot(X1-(ax + crs[0]/99),Y1-(ay + crs[1]/99),Z1-(az + crs[2]/99))
        flip = d2_>d1_?-1:1
      }
      let X2_ = ax + (crs[0]*=flip), Y2_ = ay + (crs[1]*=flip), Z2_ = az + (crs[2]*=flip)
      if(showNormals){
        x.beginPath()
        X_ = X1_, Y_ = Y1_, Z_ = Z1_
        R_(Rl,Pt,Yw,1)
        if(Z_>0) x.lineTo(...Q_())
        X_ = X2_, Y_ = Y2_, Z_ = Z2_
        R_(Rl,Pt,Yw,1)
        if(Z_>0) x.lineTo(...Q_())
        x.lineWidth = 5
        x.strokeStyle='#f004'
        x.stroke()
      }

      let p1_ = Math.atan2(X2_-X1_,Z2_-Z1_)
      let p2_ = -(Math.acos((Y2_-Y1_)/(Math.hypot(X2_-X1_,Y2_-Y1_,Z2_-Z1_)+.001))+Math.PI/2)
      let isc = false, iscs = [false,false,false]
      X_ = X1, Y_ = Y1, Z_ = Z1
      R_(0,-p2_,-p1_)
      let rx_ = X_, ry_ = Y_, rz_ = Z_
      for(let m=3;m--;){
        if(isc === false){
          X_ = rx_, Y_ = ry_, Z_ = rz_
          rotSwitch(m)
          X1_ = X_, Y1_ = Y_, Z1_ = Z_ = 5, X_ = X2, Y_ = Y2, Z_ = Z2
          R_(0,-p2_,-p1_)
          rotSwitch(m)
          X2_ = X_, Y2_ = Y_, Z2_ = Z_
          facet.map((q_,j_)=>{
            if(isc === false){
              let l = j_
              X_ = facet[l][0], Y_ = facet[l][1], Z_ = facet[l][2]
              R_(0,-p2_,-p1_)
              rotSwitch(m)
              let X3_=X_, Y3_=Y_, Z3_=Z_
              l = (j_+1)%facet.length
              X_ = facet[l][0], Y_ = facet[l][1], Z_ = facet[l][2]
              R_(0,-p2_,-p1_)
              rotSwitch(m)
              let X4_ = X_, Y4_ = Y_, Z4_ = Z_
              if(l_=I_(X1_,Y1_,X2_,Y2_,X3_,Y3_,X4_,Y4_)) iscs[m] = l_
            }
          })
        }
      }
      if(iscs.filter(v=>v!==false).length==3){
        let iscx = iscs[1][0], iscy = iscs[0][1], iscz = iscs[0][0]
        let pointInPoly = true
        ax=0, ay=0, az=0
        facet.map((q_, j_)=>{ ax+=q_[0], ay+=q_[1], az+=q_[2] })
        ax/=facet.length, ay/=facet.length, az/=facet.length
        X_ = ax, Y_ = ay, Z_ = az
        R_(0,-p2_,-p1_)
        X1_ = X_, Y1_ = Y_, Z1_ = Z_
        X2_ = iscx, Y2_ = iscy, Z2_ = iscz
        facet.map((q_,j_)=>{
          if(pointInPoly){
            let l = j_
            X_ = facet[l][0], Y_ = facet[l][1], Z_ = facet[l][2]
            R_(0,-p2_,-p1_)
            let X3_ = X_, Y3_ = Y_, Z3_ = Z_
            l = (j_+1)%facet.length
            X_ = facet[l][0], Y_ = facet[l][1], Z_ = facet[l][2]
            R_(0,-p2_,-p1_)
            let X4_ = X_, Y4_ = Y_, Z4_ = Z_
            if(I_(X1_,Y1_,X2_,Y2_,X3_,Y3_,X4_,Y4_)) pointInPoly = false
          }
        })
        if(pointInPoly){
          X_ = iscx, Y_ = iscy, Z_ = iscz
          R_(0,p2_,0)
          R_(0,0,p1_)
          isc = [[X_,Y_,Z_], [crs[0],crs[1],crs[2]]]
        }
      }
      return isc
    }

    TruncatedOctahedron = ls => {
      let shp = [], a = []
      mind = 6e6
      for(let i=6;i--;){
        X = S(p=Math.PI*2/6*i+Math.PI/6)*ls
        Y = C(p)*ls
        Z = 0
        if(Y<mind) mind = Y
        a = [...a, [X, Y, Z]]
      }
      let theta = .6154797086703867
      a.map(v=>{
        X = v[0]
        Y = v[1] - mind
        Z = v[2]
        R(0,theta,0)
        v[0] = X
        v[1] = Y
        v[2] = Z+1.5
      })
      b = JSON.parse(JSON.stringify(a)).map(v=>{
        v[1] *= -1
        return v
      })
      shp = [...shp, a, b]
      e = JSON.parse(JSON.stringify(shp)).map(v=>{
        v.map(q=>{
          X = q[0]
          Y = q[1]
          Z = q[2]
          R(0,0,Math.PI)
          q[0] = X
          q[1] = Y
          q[2] = Z
        })
        return v
      })
      shp = [...shp, ...e]
      e = JSON.parse(JSON.stringify(shp)).map(v=>{
        v.map(q=>{
          X = q[0]
          Y = q[1]
          Z = q[2]
          R(0,0,Math.PI/2)
          q[0] = X
          q[1] = Y
          q[2] = Z
        })
        return v
      })
      shp = [...shp, ...e]

      coords = [
        [[3,1],[4,3],[4,4],[3,2]],
        [[3,4],[3,3],[2,4],[6,2]],
        [[1,4],[0,3],[0,4],[4,2]],
        [[1,1],[1,2],[6,4],[7,3]],
        [[3,5],[7,5],[1,5],[3,0]],
        [[2,5],[6,5],[0,5],[4,5]]
      ]
      a = []
      coords.map(v=>{
        b = []
        v.map(q=>{
          X = shp[q[0]][q[1]][0]
          Y = shp[q[0]][q[1]][1]
          Z = shp[q[0]][q[1]][2]
          b = [...b, [X,Y,Z]]
        })
        a = [...a, b]
      })
      shp = [...shp, ...a]
      return shp.map(v=>{
        v.map(q=>{
          q[0]/=3
          q[1]/=3
          q[2]/=3
          q[0]*=ls
          q[1]*=ls
          q[2]*=ls
        })
        return v
      })
    }

    Torus = (rw, cl, ls1, ls2, parts=1, twists=0, part_spacing=1.5) => {
     t_ = C(t)*8
     let ret = [], tx=0, ty=0, tz=0, prl1 = 0, p2a = 0, prl2=0, p2b = 0
      tx1=ty1=tz1=tx2=ty2=tz2=0
      for(let m=parts;m--;){
        avgs = Array(rw).fill().map(v=>[0,0,0])
        for(j=rw;j--;)for(let i = cl;i--;){
          if(parts>1){
            ls3 = ls1*part_spacing
            X = S(p=Math.PI*2/parts*m) * ls3
            Y = C(p) * ls3
            Z = 0
            R(prl1 = Math.PI*2/rw*(j-1)*twists+t_,0,0)
            tx1 = X
            ty1 = Y 
            tz1 = Z
            R(0, 0, Math.PI*2/rw*(j-1))
            ax1 = X
            ay1 = Y
            az1 = Z
            X = S(p=Math.PI*2/parts*m) * ls3
            Y = C(p) * ls3
            Z = 0
            R(prl2 = Math.PI*2/rw*(j)*twists+t_,0,0)
            tx2 = X
            ty2 = Y
            tz2 = Z
            R(0, 0, Math.PI*2/rw*j)
            ax2 = X
            ay2 = Y
            az2 = Z
            p1a = Math.atan2(ax2-ax1,az2-az1)
            p2a = Math.PI/2+Math.acos((ay2-ay1)/(Math.hypot(ax2-ax1,ay2-ay1,az2-az1)+.001))

            X = S(p=Math.PI*2/parts*m) * ls3
            Y = C(p) * ls3
            Z = 0
            R(Math.PI*2/rw*(j)*twists+t_,0,0)
            tx1b = X
            ty1b = Y
            tz1b = Z
            R(0, 0, Math.PI*2/rw*j)
            ax1b = X
            ay1b = Y
            az1b = Z
            X = S(p=Math.PI*2/parts*m) * ls3
            Y = C(p) * ls3
            Z = 0
            R(Math.PI*2/rw*(j+1)*twists+t_,0,0)
            tx2b = X
            ty2b = Y
            tz2b = Z
            R(0, 0, Math.PI*2/rw*(j+1))
            ax2b = X
            ay2b = Y
            az2b = Z
            p1b = Math.atan2(ax2b-ax1b,az2b-az1b)
            p2b = Math.PI/2+Math.acos((ay2b-ay1b)/(Math.hypot(ax2b-ax1b,ay2b-ay1b,az2b-az1b)+.001))
          }
          a = []
          X = S(p=Math.PI*2/cl*i) * ls1
          Y = C(p) * ls1
          Z = 0
          //R(0,0,-p1a)
          R(prl1,p2a,0)
          X += ls2 + tx1, Y += ty1, Z += tz1
          R(0, 0, Math.PI*2/rw*j)
          a = [...a, [X,Y,Z]]
          X = S(p=Math.PI*2/cl*(i+1)) * ls1
          Y = C(p) * ls1
          Z = 0
          //R(0,0,-p1a)
          R(prl1,p2a,0)
          X += ls2 + tx1, Y += ty1, Z += tz1
          R(0, 0, Math.PI*2/rw*j)
          a = [...a, [X,Y,Z]]
          X = S(p=Math.PI*2/cl*(i+1)) * ls1
          Y = C(p) * ls1
          Z = 0
          //R(0,0,-p1b)
          R(prl2,p2b,0)
          X += ls2 + tx2, Y += ty2, Z += tz2
          R(0, 0, Math.PI*2/rw*(j+1))
          a = [...a, [X,Y,Z]]
          X = S(p=Math.PI*2/cl*i) * ls1
          Y = C(p) * ls1
          Z = 0
          //R(0,0,-p1b)
          R(prl2,p2b,0)
          X += ls2 + tx2, Y += ty2, Z += tz2
          R(0, 0, Math.PI*2/rw*(j+1))
          a = [...a, [X,Y,Z]]
          ret = [...ret, a]
        }
      }
      return ret
    }

    Cylinder = (rw, cl, ls1, ls2, caps=false) => {
      let a = []
      for(let i=rw;i--;){
        let b = []
        for(let j=cl;j--;){
          X = S(p=Math.PI*2/cl*j) * ls1
          Y = (1/rw*i-.5)*ls2
          Z = C(p) * ls1
          b = [...b, [X,Y,Z]]
        }
        if(caps) a = [...a, b]
        for(let j=cl;j--;){
          b = []
          X = S(p=Math.PI*2/cl*j) * ls1
          Y = (1/rw*i-.5)*ls2
          Z = C(p) * ls1
          b = [...b, [X,Y,Z]]
          X = S(p=Math.PI*2/cl*(j+1)) * ls1
          Y = (1/rw*i-.5)*ls2
          Z = C(p) * ls1
          b = [...b, [X,Y,Z]]
          X = S(p=Math.PI*2/cl*(j+1)) * ls1
          Y = (1/rw*(i+1)-.5)*ls2
          Z = C(p) * ls1
          b = [...b, [X,Y,Z]]
          X = S(p=Math.PI*2/cl*j) * ls1
          Y = (1/rw*(i+1)-.5)*ls2
          Z = C(p) * ls1
          b = [...b, [X,Y,Z]]
          a = [...a, b]
        }
      }
      b = []
      for(let j=cl;j--;){
        X = S(p=Math.PI*2/cl*j) * ls1
        Y = ls2/2
        Z = C(p) * ls1
        //b = [...b, [X,Y,Z]]
      }
      if(caps) a = [...a, b]
      return a
    }

    Tetrahedron = size => {
      ret = []
      a = []
      let h = size/1.4142/1.25
      for(i=3;i--;){
        X = S(p=Math.PI*2/3*i) * size/1.25
        Y = C(p) * size/1.25
        Z = h
        a = [...a, [X,Y,Z]]
      }
      ret = [...ret, a]
      for(j=3;j--;){
        a = []
        X = 0
        Y = 0
        Z = -h
        a = [...a, [X,Y,Z]]
        X = S(p=Math.PI*2/3*j) * size/1.25
        Y = C(p) * size/1.25
        Z = h
        a = [...a, [X,Y,Z]]
        X = S(p=Math.PI*2/3*(j+1)) * size/1.25
        Y = C(p) * size/1.25
        Z = h
        a = [...a, [X,Y,Z]]
        ret = [...ret, a]
      }
      ax=ay=az=ct=0
      ret.map(v=>{
        v.map(q=>{
          ax+=q[0]
          ay+=q[1]
          az+=q[2]
          ct++
        })
      })
      ax/=ct
      ay/=ct
      az/=ct
      ret.map(v=>{
        v.map(q=>{
          q[0]-=ax
          q[1]-=ay
          q[2]-=az
        })
      })
      return ret
    }

    Cube = size => {
      for(CB=[],j=6;j--;CB=[...CB,b])for(b=[],i=4;i--;)b=[...b,[(a=[S(p=Math.PI*2/4*i+Math.PI/4),C(p),2**.5/2])[j%3]*(l=j<3?size/2**.5:-size/2**.5),a[(j+1)%3]*l,a[(j+2)%3]*l]]
      return CB
    }

    Octahedron = size => {
      ret = []
      let h = size/1.25
      for(j=8;j--;){
        a = []
        X = 0
        Y = 0
        Z = h * (j<4?-1:1)
        a = [...a, [X,Y,Z]]
        X = S(p=Math.PI*2/4*j) * size/1.25
        Y = C(p) * size/1.25
        Z = 0
        a = [...a, [X,Y,Z]]
        X = S(p=Math.PI*2/4*(j+1)) * size/1.25
        Y = C(p) * size/1.25
        Z = 0
        a = [...a, [X,Y,Z]]
        ret = [...ret, a]
      }
      return ret      
    }

    Dodecahedron = size => {
      ret = []
      a = []
      mind = -6e6
      for(i=5;i--;){
        X=S(p=Math.PI*2/5*i + Math.PI/5)
        Y=C(p)
        Z=0
        if(Y>mind) mind=Y
        a = [...a, [X,Y,Z]]
      }
      a.map(v=>{
        X = v[0]
        Y = v[1]-=mind
        Z = v[2]
        R(0, .553573, 0)
        v[0] = X
        v[1] = Y
        v[2] = Z
      })
      b = JSON.parse(JSON.stringify(a))
      b.map(v=>{
        v[1] *= -1
      })
      ret = [...ret, a, b]
      mind = -6e6
      ret.map(v=>{
        v.map(q=>{
          X = q[0]
          Y = q[1]
          Z = q[2]
          if(Z>mind)mind = Z
        })
      })
      d1=Math.hypot(ret[0][0][0]-ret[0][1][0],ret[0][0][1]-ret[0][1][1],ret[0][0][2]-ret[0][1][2])
      ret.map(v=>{
        v.map(q=>{
          q[2]-=mind+d1/2
        })
      })
      b = JSON.parse(JSON.stringify(ret))
      b.map(v=>{
        v.map(q=>{
          q[2]*=-1
        })
      })
      ret = [...ret, ...b]
      b = JSON.parse(JSON.stringify(ret))
      b.map(v=>{
        v.map(q=>{
          X = q[0]
          Y = q[1]
          Z = q[2]
          R(0,0,Math.PI/2)
          R(0,Math.PI/2,0)
          q[0] = X
          q[1] = Y
          q[2] = Z
        })
      })
      e = JSON.parse(JSON.stringify(ret))
      e.map(v=>{
        v.map(q=>{
          X = q[0]
          Y = q[1]
          Z = q[2]
          R(0,0,Math.PI/2)
          R(Math.PI/2,0,0)
          q[0] = X
          q[1] = Y
          q[2] = Z
        })
      })
      ret = [...ret, ...b, ...e]
      ret.map(v=>{
        v.map(q=>{
          q[0] *= size/2
          q[1] *= size/2
          q[2] *= size/2
        })
      })
      return ret
    }

    Icosahedron = size => {
      ret = []
      let B = [
        [[0,3],[1,0],[2,2]],
        [[0,3],[1,0],[1,3]],
        [[0,3],[2,3],[1,3]],
        [[0,2],[2,1],[1,0]],
        [[0,2],[1,3],[1,0]],
        [[0,2],[1,3],[2,0]],
        [[0,3],[2,2],[0,0]],
        [[1,0],[2,2],[2,1]],
        [[1,1],[2,2],[2,1]],
        [[1,1],[2,2],[0,0]],
        [[1,1],[2,1],[0,1]],
        [[0,2],[2,1],[0,1]],
        [[2,0],[1,2],[2,3]],
        [[0,0],[0,3],[2,3]],
        [[1,3],[2,0],[2,3]],
        [[2,3],[0,0],[1,2]],
        [[1,2],[2,0],[0,1]],
        [[0,0],[1,2],[1,1]],
        [[0,1],[1,2],[1,1]],
        [[0,2],[2,0],[0,1]],
      ]
      for(p=[1,1],i=38;i--;)p=[...p,p[l=p.length-1]+p[l-1]]
      phi = p[l]/p[l-1]
      a = [
        [-phi,-1,0],
        [phi,-1,0],
        [phi,1,0],
        [-phi,1,0],
      ]
      for(j=3;j--;ret=[...ret, b])for(b=[],i=4;i--;) b = [...b, [a[i][j],a[i][(j+1)%3],a[i][(j+2)%3]]]
      ret.map(v=>{
        v.map(q=>{
          q[0]*=size/2.25
          q[1]*=size/2.25
          q[2]*=size/2.25
        })
      })
      cp = JSON.parse(JSON.stringify(ret))
      out=[]
      a = []
      B.map(v=>{
        idx1a = v[0][0]
        idx2a = v[1][0]
        idx3a = v[2][0]
        idx1b = v[0][1]
        idx2b = v[1][1]
        idx3b = v[2][1]
        a = [...a, [cp[idx1a][idx1b],cp[idx2a][idx2b],cp[idx3a][idx3b]]]
      })
      out = [...out, ...a]
      return out
    }

    subbed = (subs, size, sphereize, shape) => {
      for(let m=subs; m--;){
        base = shape
        shape = []
        base.map(v=>{
          l = 0
          X1 = v[l][0]
          Y1 = v[l][1]
          Z1 = v[l][2]
          l = 1
          X2 = v[l][0]
          Y2 = v[l][1]
          Z2 = v[l][2]
          l = 2
          X3 = v[l][0]
          Y3 = v[l][1]
          Z3 = v[l][2]
          if(v.length > 3){
            l = 3
            X4 = v[l][0]
            Y4 = v[l][1]
            Z4 = v[l][2]
            if(v.length > 4){
              l = 4
              X5 = v[l][0]
              Y5 = v[l][1]
              Z5 = v[l][2]
            }
          }
          mx1 = (X1+X2)/2
          my1 = (Y1+Y2)/2
          mz1 = (Z1+Z2)/2
          mx2 = (X2+X3)/2
          my2 = (Y2+Y3)/2
          mz2 = (Z2+Z3)/2
          a = []
          switch(v.length){
            case 3:
              mx3 = (X3+X1)/2
              my3 = (Y3+Y1)/2
              mz3 = (Z3+Z1)/2
              X = X1, Y = Y1, Z = Z1, a = [...a, [X,Y,Z]]
              X = mx1, Y = my1, Z = mz1, a = [...a, [X,Y,Z]]
              X = mx3, Y = my3, Z = mz3, a = [...a, [X,Y,Z]]
              shape = [...shape, a]
              a = []
              X = mx1, Y = my1, Z = mz1, a = [...a, [X,Y,Z]]
              X = X2, Y = Y2, Z = Z2, a = [...a, [X,Y,Z]]
              X = mx2, Y = my2, Z = mz2, a = [...a, [X,Y,Z]]
              shape = [...shape, a]
              a = []
              X = mx3, Y = my3, Z = mz3, a = [...a, [X,Y,Z]]
              X = mx2, Y = my2, Z = mz2, a = [...a, [X,Y,Z]]
              X = X3, Y = Y3, Z = Z3, a = [...a, [X,Y,Z]]
              shape = [...shape, a]
              a = []
              X = mx1, Y = my1, Z = mz1, a = [...a, [X,Y,Z]]
              X = mx2, Y = my2, Z = mz2, a = [...a, [X,Y,Z]]
              X = mx3, Y = my3, Z = mz3, a = [...a, [X,Y,Z]]
              shape = [...shape, a]
              break
            case 4:
              mx3 = (X3+X4)/2
              my3 = (Y3+Y4)/2
              mz3 = (Z3+Z4)/2
              mx4 = (X4+X1)/2
              my4 = (Y4+Y1)/2
              mz4 = (Z4+Z1)/2
              cx = (X1+X2+X3+X4)/4
              cy = (Y1+Y2+Y3+Y4)/4
              cz = (Z1+Z2+Z3+Z4)/4
              X = X1, Y = Y1, Z = Z1, a = [...a, [X,Y,Z]]
              X = mx1, Y = my1, Z = mz1, a = [...a, [X,Y,Z]]
              X = cx, Y = cy, Z = cz, a = [...a, [X,Y,Z]]
              X = mx4, Y = my4, Z = mz4, a = [...a, [X,Y,Z]]
              shape = [...shape, a]
              a = []
              X = mx1, Y = my1, Z = mz1, a = [...a, [X,Y,Z]]
              X = X2, Y = Y2, Z = Z2, a = [...a, [X,Y,Z]]
              X = mx2, Y = my2, Z = mz2, a = [...a, [X,Y,Z]]
              X = cx, Y = cy, Z = cz, a = [...a, [X,Y,Z]]
              shape = [...shape, a]
              a = []
              X = cx, Y = cy, Z = cz, a = [...a, [X,Y,Z]]
              X = mx2, Y = my2, Z = mz2, a = [...a, [X,Y,Z]]
              X = X3, Y = Y3, Z = Z3, a = [...a, [X,Y,Z]]
              X = mx3, Y = my3, Z = mz3, a = [...a, [X,Y,Z]]
              shape = [...shape, a]
              a = []
              X = mx4, Y = my4, Z = mz4, a = [...a, [X,Y,Z]]
              X = cx, Y = cy, Z = cz, a = [...a, [X,Y,Z]]
              X = mx3, Y = my3, Z = mz3, a = [...a, [X,Y,Z]]
              X = X4, Y = Y4, Z = Z4, a = [...a, [X,Y,Z]]
              shape = [...shape, a]
              break
            case 5:
              cx = (X1+X2+X3+X4+X5)/5
              cy = (Y1+Y2+Y3+Y4+Y5)/5
              cz = (Z1+Z2+Z3+Z4+Z5)/5
              mx3 = (X3+X4)/2
              my3 = (Y3+Y4)/2
              mz3 = (Z3+Z4)/2
              mx4 = (X4+X5)/2
              my4 = (Y4+Y5)/2
              mz4 = (Z4+Z5)/2
              mx5 = (X5+X1)/2
              my5 = (Y5+Y1)/2
              mz5 = (Z5+Z1)/2
              X = X1, Y = Y1, Z = Z1, a = [...a, [X,Y,Z]]
              X = X2, Y = Y2, Z = Z2, a = [...a, [X,Y,Z]]
              X = cx, Y = cy, Z = cz, a = [...a, [X,Y,Z]]
              shape = [...shape, a]
              a = []
              X = X2, Y = Y2, Z = Z2, a = [...a, [X,Y,Z]]
              X = X3, Y = Y3, Z = Z3, a = [...a, [X,Y,Z]]
              X = cx, Y = cy, Z = cz, a = [...a, [X,Y,Z]]
              shape = [...shape, a]
              a = []
              X = X3, Y = Y3, Z = Z3, a = [...a, [X,Y,Z]]
              X = X4, Y = Y4, Z = Z4, a = [...a, [X,Y,Z]]
              X = cx, Y = cy, Z = cz, a = [...a, [X,Y,Z]]
              shape = [...shape, a]
              a = []
              X = X4, Y = Y4, Z = Z4, a = [...a, [X,Y,Z]]
              X = X5, Y = Y5, Z = Z5, a = [...a, [X,Y,Z]]
              X = cx, Y = cy, Z = cz, a = [...a, [X,Y,Z]]
              shape = [...shape, a]
              a = []
              X = X5, Y = Y5, Z = Z5, a = [...a, [X,Y,Z]]
              X = X1, Y = Y1, Z = Z1, a = [...a, [X,Y,Z]]
              X = cx, Y = cy, Z = cz, a = [...a, [X,Y,Z]]
              shape = [...shape, a]
              a = []
              break
          }
        })
      }
      if(sphereize){
        ip1 = sphereize
        ip2 = 1-sphereize
        shape = shape.map(v=>{
          v = v.map(q=>{
            X = q[0]
            Y = q[1]
            Z = q[2]
            d = Math.hypot(X,Y,Z)
            X /= d
            Y /= d
            Z /= d
            X *= size/2*ip1 + d*ip2
            Y *= size/2*ip1 + d*ip2
            Z *= size/2*ip1 + d*ip2
            return [X,Y,Z]
          })
          return v
        })
      }
      return shape
    }

    subDividedIcosahedron  = (size, subs, sphereize = 0) => subbed(subs, size, sphereize, Icosahedron(size))
    subDividedTetrahedron  = (size, subs, sphereize = 0) => subbed(subs, size, sphereize, Tetrahedron(size))
    subDividedOctahedron   = (size, subs, sphereize = 0) => subbed(subs, size, sphereize, Octahedron(size))
    subDividedCube         = (size, subs, sphereize = 0) => subbed(subs, size, sphereize, Cube(size))
    subDividedDodecahedron = (size, subs, sphereize = 0) => subbed(subs, size, sphereize, Dodecahedron(size))

    stroke = (scol, fcol, lw, dl, oga=1, ocp=true) => {
      if(scol){
        x.strokeStyle = scol
        if(ocp) x.closePath()
        x.lineWidth = Math.min(100, 50/Z*lw)
        if(dl){
          x.globalAlpha = .25 * oga
          x.stroke()
          x.lineWidth/=3
        }
        x.globalAlpha = 1*oga
        x.stroke()
      }
      if(fcol){
        x.globalAlpha = 1*oga
        x.fillStyle = fcol
        x.fill()
      }
    }

    drawSphere = (tx,ty,tz,rad) => {
      if(1||Math.hypot(tx,ty,tz)<trad2){
        X1 = X = tx * mls
        Y1 = Y = ty * mls
        Z1 = Z = tz * mls
        R(Rl,Pt,Yw,1)
        if(Z>0){
          ls = rad/Z
          forSort = [...forSort, [Q(), Z, forSort.length, X1, Y1, Z1, ls]]
        }
      }
    }

    sphereSrc = [
    'https://srmcgann.github.io/temp13/red_ball.png',
    //'https://srmcgann.github.io/temp13/orange_ball.png',
    'https://srmcgann.github.io/temp13/yellow_ball.png',
    //'https://srmcgann.github.io/temp13/green_ball.png',
    'https://srmcgann.github.io/temp13/teal_ball.png',
    'https://srmcgann.github.io/temp13/blue_ball.png',
    //'https://srmcgann.github.io/temp13/purple_ball.png',
    //'https://srmcgann.github.io/temp13/pink_ball.png',
    ]
    spheres = []
    sphereSrc.map(v => {
      let a = new Image()
      a.src = v
      spheres = [...spheres, a]
    })
    
    loadB = () => {
      cl  = 10
      rw  = 10
      sp  = 2
      iBr = 1.66
      rct = 0
      ofy = 5.66
      B = Array(cl*rw).fill().map((v, i) => {
        X = ((i%cl)-cl/2 + .5) * sp * 1.5 + ((i/cl|0)%2?sp*1.5/2:0) - sp/2.66
        Y = ((i/cl|0)-rw/2 + .5) * sp * (.75**.5/2) - sp * (.75**.5/2) * ofy
        Z = 0
        id = Rn()<sFreq ? -(1 + Rn()**2 * sNum | 0) : Rn() * sphereSrc.length | 0
        vx = vy = vz = 0
        return [X, Y, Z, vx, vy, vz, id, X, Y, Z]
      })
    }
    
    freq = 2e3
    
    advanceRows = () => {
      B.map(v=>{
        //v[1] += sp * (.75**.5/2)
        v[8] += sp * (.75**.5/2)
      })
      for(j=0; j<cl; j++){
        let i = j + (rct%2 ? 0 : cl)
        ofy_ = i%cl != 0 || !(rct%2) ? 0 : sp * (.75**.5/2)
        X = ((i%cl)-cl/2 + .5) * sp * 1.5 + ((i/cl|0)%2?sp*1.5/2:0) - sp/2.66
        Y = (((i-cl)/cl|0)-rw/2 + .5) * sp * (.75**.5/2) - sp * (.75**.5/2) * ofy + ofy_
        Z = 0
        id = Rn()<sFreq ? -(1 + Rn()**2 * sNum | 0) : Rn() * sphereSrc.length | 0
        vx = vy = vz = 0
        B = [[X, Y, Z, vx, vy, vz, id, X, Y, Z, false], ...B]
      }
      rct++
    }
    
    bg = new Image()
    bg.src = 'https://srmcgann.github.io/temp14/bobble_board.png?5'
    
    
    keys = Array(128).fill(false)
    c.onkeydown = e => {
      keys[e.keyCode] = true
    }
    c.onkeyup = e => {
      keys[e.keyCode] = false
    }
    
    shotTimer = 0
    shotTimerInterval = .25
    shotSpeed = .66
    shoot = () => {
      if(curShot.fired || shotTimer > t || roundover) return 
      curShot.X_ = S(p=sTheta + Math.PI) * ls
      curShot.Y_ = C(p) * ls + 11 -ls /2.5
      curShot.Z_ = 0
      curShot.vx2 = -S(p=sTheta) * shotSpeed
      curShot.vy2 = -C(p) * shotSpeed
      curShot.vz2 = 0
      curShot.fired = true
      shotTimer = t + shotTimerInterval
    }
    
    sTv = -.0066
    drag   = 1.4
    drag2   = 10
    gunLength = 1
    sThetav = 0
    sTheta = 0
    doKeys = () => {
      keys.map((v, i) => {
        if(v){
          switch(i){
            case 37:
              sThetav = Math.max(0, sThetav)
              sThetav -= sTv - sThetav/3
            break;
            case 39:
              sThetav = Math.min(0, sThetav)
              sThetav += sTv + sThetav/3 
            break;
            case 40:
            break;
            case 17: case 32: case 38:
              if(roundover){
                init(victory)
                shotTimer = t + shotTimerInterval
              }else{
                shoot()
              }
              
            break;
          }
        }
      })
    }
    
    c.focus()
    
    loadShot = () => {
      if(roundover) return
      curShot = {
        idx: queue.shift(),
        X: 0,
        Y: 11 - ls,
        Z: 0,
        X_: 0,
        Y_: 11 - ls,
        Z_: 0,
        vx: 0,
        vy: 0,
        vz: 0,
        vx2: 0,
        vy2: 0,
        vz2: 0,
        fired: false
      }
      queue = [...queue, Rn()*sphereSrc.length|0]
    }
    
    sparks = []
    iSparkv = .05
    spawnSparks = (X, Y, Z, id, mag=1) => {
      for(let m = 50; m--;){
        v = Rn()**.5 * iSparkv * mag
        vx = S(p=Math.PI*2*Rn()) * S(q=Rn()<.5 ? Math.PI/2*Rn()**.5 : Math.PI - Math.PI/2*Rn()**.5) * v
        vy = C(q) * v
        vz = C(p) * S(q) * v
        sparks = [...sparks, [X, Y, Z, vx, vy, vz, mag, id]]
      }
    }
    
    init = (victory=false) => {
      if(typeof deathTimer !== 'undefined' && deathTimer >= t) return
      score = victory ? score : 0
      sFreq = .04
      sNum  = 2
      deathTimerInterval = .5
      deathTimer = t + deathTimerInterval
      ballValue = 100
      victory = false
      if(typeof highScore == 'undefined') highScore = 0
      rct = 0
      loadB()
      roundover = false
      gameinplay = true
      iQueuec = 16
      queue = Array(iQueuec).fill().map(v=>Rn()*sphereSrc.length|0)
      grav = .1
      ls = 3
      loadShot()
    }
    init()

    checkCompletions = (X, Y, Z, id) => {
      if(!curShot.fired || id < 0) return
      if(memo.filter(v=>Math.hypot(v[0]-X, v[1]-Y, v[2]-Z) < .1).length) return
      memo = [...memo, [X, Y, Z]]
      B.map((v, i) => {
        if(id == v[6] || v[6] < 0){
          tx = v[0]
          ty = v[1]
          tz = v[2]
          if((d = Math.hypot(tx-X, ty-Y, tz-Z))<iBr * 1.1 && d>.9){
            if(v[6] < 0){
              if(!memo.filter(q=>q==i).length){
                memo = [...memo, [tx, ty, tz]]
                cull = [...cull, i]
                switch(v[6]){
                  case -2:
                    spawnSparks(v[0], v[1], v[2], 4, 4);
                    B.map((q, j) => {
                      if(q[1] > -6 && Math.hypot(tx-q[0], ty-q[1], tz-q[2]) < iBr * 4){
                        cull = [...cull, j]
                      }
                    })
                    break
                  case -1:
                    spawnSparks(v[0], v[1], v[2], 0, 2);
                    B.map((q, j) => {
                      if(q[1] > -6 && Math.hypot(tx-q[0], ty-q[1], tz-q[2]) < iBr * 2){
                        cull = [...cull, j]
                      }
                    })
                    break
                }
              }
            }else{
              cull = [...cull, i]
            }
            checkCompletions(tx, ty, tz, id)
          }
        }
      })
    }
    
    dropPieces = idx => {
      if(memo.filter(v=>v==idx).length) return
      memo = [...memo, idx]
      B.map((v, i) => {
        X1 = v[0]
        Y1 = v[1]
        Z1 = v[2]
        ct = 0
        if(i != idx){
          X2 =B[idx][0]
          Y2 =B[idx][1]
          Z2 =B[idx][2]
          if((d=Math.hypot(X2-X1, Y2-Y1, Z2-Z1)) < iBr * 1.5) dropPieces(i)
        }
      })
    }
    
    drawRotatedImage = (img,tx,ty,w,h,theta,ofx=0,ofy=0)=>{
      x.save()
      x.translate(tx,ty)
      x.rotate(theta)
      x.drawImage(img,-w/2+ofx,-h/2+ofy,w,h)
      x.restore()
    }
    
    placeCurShot = () => {
      if(roundover) return
      mind = 1e6
      rct_ = 0
      ofy2_ = rct%2 ? 0 : sp * (.75**.5/2)
      for(i=cl*(rw+1)*3;i--;){
        X = ((i%cl)-cl/2 + .5) * sp * 1.5 + ((i/cl|0)%2?sp*1.5/2:0) - sp/2.66
        Y = ((((i-cl)/cl|0)-rw/2 + .5) * sp * (.75**.5/2) - sp * (.75**.5/2) * ofy) + ofy2_
        Z = 0
        if((d = Math.hypot(X1-X,Y1-Y,Z1-Z))<mind && !B.filter(v=>{
          return Math.hypot(v[0]-X,v[1]-Y,v[2]-Z) < .1
        }).length){
          mind = d
          idx = i
        }
      }
      i = idx
      X = ((i%cl)-cl/2 + .5) * sp * 1.5 + ((i/cl|0)%2?sp*1.5/2:0) - sp/2.66
      Y = ((((i-cl)/cl|0)-rw/2 + .5) * sp * (.75**.5/2) - sp * (.75**.5/2) * ofy) + ofy2_
      Z = 0
      vx = vy = vz = 0
      id = curShot.idx
      B = [...B, [X, Y, Z, vx, vy, vz, id, X, Y, Z]]
      memo = []
      cull = []
      checkCompletions(X,Y,Z,id)
      cull = Array.from(new Set(cull))
      if(cull.length > 2){
        score += cull.length * ballValue
        highScore = Math.max(score, highScore)
        B = B.filter((v, i) => {
          ret = !cull.filter(q=>q==i).length
          if(!ret){
            spawnSparks(v[0], v[1], v[2], v[6])
          }
          return ret
        })
        memo = []
        dropPieces(0)
        B.map((v, i) => {
          if(!memo.filter(v=>v==i).length) v[10]=true
        })
      }else{
        X1 = curShot.X_ + curShot.vx2 * 2
        Y1 = curShot.Y_ + curShot.vy2 * 2
        Z1 = curShot.Z_ + curShot.vz2 * 2
        X2 = 0
        Y2 = 9.1
        Z2 = 0
        if((d=Math.hypot(X1-X2,Y1-Y2,Z1-Z2))<3){
          console.log(1)
          console.log(X1,Y1,Z1,X2,Y2,Z2)
          if(d>2) {
            roundover = true
            deathTimer = t + deathTimerInterval
          }else {
            //B = [...B, [X, Y, Z, vx, vy, vz, id, X, Y, Z]]
          }
          return
        }
      }
      loadShot()
    }
    
    death = new Image()
    death.src = 'https://srmcgann.github.io/temp13/gosper.jpg'
    vicpic = new Image()
    vicpic.src = 'https://srmcgann.github.io/temp13/vicpic.jpg'
  }

  delta = Math.max(0, ((freq-((t*60|0)%freq))/freq)**.1 + (.5+S(t*40)/2)/50)
  x.globalAlpha = 1
  x.fillStyle   = `hsla(${0},99%,${50-(delta*50)}%,.8)`
  x.fillRect(0,0,c.width,c.height)
  x.lineJoin    = x.lineCap = 'butt'
  x.textAlign = 'center'

  oX  = 0
  oY  = 0
  oZ  = 11.85
  Rl  = 0
  Pt  = 0
  Yw  = 0
  
  if(0)for(i=cl*(rw+1)*3;i--;){
    ofy2_ = rct%2 ? 0 : sp * (.75**.5/2)
    X = ((i%cl)-cl/2 + .5) * sp * 1.5 + ((i/cl|0)%2?sp*1.5/2:0) - sp/2.66
    Y = ((((i-cl)/cl|0)-rw/2 + .5) * sp * (.75**.5/2) - sp * (.75**.5/2) * ofy) + ofy2_
    Z = 0
    R(Rl,Pt,Yw,1)
    if(Z>0){
      l = Q()
      s = Math.min(1e3, 1e3/Z)
      x.fillStyle = '#ff000006'
      x.fillRect(l[0]-s/2,l[1]-s/2,s,s)
      s/=3
      x.fillStyle = '#ff880012'
      x.fillRect(l[0]-s/2,l[1]-s/2,s,s)
      s/=3
      x.fillStyle = '#ffffffff'
      x.fillRect(l[0]-s/2,l[1]-s/2,s,s)
    }
  }
  
  sTheta += sThetav /= drag
  
  sTheta = Math.min(Math.PI/2.125, Math.max(-Math.PI/2.125, sTheta))
  
  if(sTheta == Math.PI/2.25 || sTheta == -Math.PI/2.25){
    sThetav = 0
  }
  
  doKeys()
  
  if(!roundover && !((t*60|0)%freq)) advanceRows()
  
  homing  = 20
  homing2 = 2
  B.map((v, i) => {
    if(v[10]) {
      v[4] += grav
      v[8] += v[4]
    }
    v[3] /= drag
    v[4] /= drag
    v[5] /= drag
    vx = v[3] += (v[7] - v[0]) / homing
    vy = v[4] += (v[8] - v[1]) / homing
    vz = v[5] += (v[9] - v[2]) / homing
    tx = v[0] += vx
    ty = v[1] += vy
    tz = v[2] += vz
    X = tx
    Y = ty
    Z = tz
    R(Rl,Pt,Yw,1)
    if(Z>0){
      l = Q()
      s = Math.min(1e4, 700/Z*iBr)
      let img
      switch(v[6]){
        case -2:
          img = starImgs[0].img
          img2 = starImgs[4].img
          s*=3
          s2 = (1.5+C(t*40)/4) /2
          ofx1 = 0
          ofy1 = 0
          ofx2 = s*.0175 * s2
          ofy2 = s*.0175 * s2
        break
        case -1:
          img = burst
          img2 = starImgs[0].img
          s*=2
          s2 = (1.5+C(t*40)/4)
          ofx1 = 0
          ofy1 = 0
          ofx2 = 0
          ofy2 = 0
        break
        default:
          img = spheres[v[6]]
          ofx1 = 0
          ofy1 = 0
          ofx2 = 0
          ofy2 = 0
        break
      }
      x.drawImage(img, l[0]-s/2 + ofx1, l[1]-s/2 + ofy1, s, s)
      if(v[6] < 0){
        s *= s2
        drawRotatedImage(img2, l[0], l[1], s, s, t*2, ofx2, ofy2)
      }
      //x.font = (fs = 50) + 'px Courier'
      //x.fillStyle = x.strokeStyle = '#fff'
      //x.fillText((i%cl),l[0], l[1] + fs/3)
    }
  })
  if(0) B.map(v => {
    tx = v[0]
    ty = v[1]
    tz = v[2]
    x.beginPath()
    for(j=6;j--;){
      X = tx + S(p=Math.PI*2/6 * j + Math.PI/6) * 1
      Y = ty + C(p) * 1
      Z = tz
      R(Rl,Pt,Yw,1)
      if(Z>0) x.lineTo(...Q())
    }
    stroke('#f00','',.5,false)
  })
  
  sd = 16
  x.beginPath()
  for(i=sd+1; i--;) {
    X = S(p=Math.PI*1/sd*i+Math.PI/2) * ls
    Y = C(p) * ls + 9.5
    Z = 0
    R(Rl,Pt,Yw,1)
    if(Z>0){
      x.lineTo(...Q())
    }
  }
  col1 = '#f004'
  col2 = '#40f2'
  stroke(col1, col2, 10, true)
  
  x.beginPath()
  X = S(p=sTheta + Math.PI) * ls
  Y = C(p) * ls + 9.5
  Z = 0
  R(Rl,Pt,Yw,1)
  if(Z>0) x.lineTo(...Q())
  X = S(p=sTheta + Math.PI) * (ls + gunLength)
  Y = C(p) * (ls + gunLength) + 9.5
  Z = 0
  R(Rl,Pt,Yw,1)
  if(Z>0) x.lineTo(...Q())
  stroke(col1, '', 10, true)
  
  // scaffolding
  ofx = 15.125
  //x.beginPath()
  X1a = X = -ofx
  Y1a = Y = -10
  //Z = 0
  //R(Rl,Pt,Yw,1)
  //if(Z>0) x.lineTo(...Q())
  X2a = X = -ofx
  Y2a = Y = 10
  //Z = 0
  //R(Rl,Pt,Yw,1)
  //if(Z>0) x.lineTo(...Q())
  //stroke('#0f8','',1, false)

  //x.beginPath()
  X1b = X = ofx
  Y1b = Y = -10
  //Z = 0
  //R(Rl,Pt,Yw,1)
  //if(Z>0) x.lineTo(...Q())
  X2b = X = ofx
  Y2b = Y = 10
  //Z = 0
  //R(Rl,Pt,Yw,1)
  //if(Z>0) x.lineTo(...Q())
  //stroke('#0f8','',1, false)
  // end scaffolding
  
  iTv = .05
  tx = S(p=sTheta + Math.PI) * ls
  ty = C(p) * ls + 9.5
  vx = S(p) * iTv
  vy = C(p) * iTv
  cont = true
  for(i=1; cont && i<1e3; i++) {
    X3 = tx += vx
    Y3 = ty += vy
    X4 = X3 + vx
    Y4 = Y3 + vy
    
    cont = true
    B.map(v=>{
      X = v[0]
      Y = v[1]
      Z = v[2]
      if((d=Math.hypot(X-X4, Y-Y4)) < iBr/2){
        cont = false
      }
    })
    if(cont){
      a = [
        vx/iTv,
        vy/iTv,
        0
      ]
      if((l = I(e = X1a,Y1a, f = X2a,Y2a,X3,Y3,X4,Y4))){
        n = [1, 0, 0]
        b = reflect(a, n)
        d = Math.hypot(...b)
        vx = b[0] / d * iTv
        vy = b[1] / d * iTv
      }
      if((l = I(X1b,Y1b,X2b,Y2b,X3,Y3,X4,Y4))){
        p = Math.atan2(X2b-X1b, Y2b-Y1b) + Math.PI/2
        n = [-1, 0, 0]
        d = Math.hypot(X2b - X1b, Y2b - Y1b)
        b = reflect(a, n)
        d = Math.hypot(...b)
        vx = b[0] / d * iTv
        vy = b[1] / d * iTv
        tx = l[0]
        ty = l[1]
      }
      
      /*X3 = tx
      Y3 = ty
      X4 = X3 + vx
      Y4 = Y3 + vy*/
      
      if(!(i%10)){
        x.beginPath()
        X = X3
        Y = Y3
        Z = 0
        R(Rl,Pt,Yw,1)
        if(Z>0) x.lineTo(...Q())
        X = X4 - vx*5
        Y = Y4 - vy*5
        Z = 0
        R(Rl,Pt,Yw,1)
        if(Z>0) x.lineTo(...Q())
        stroke('#fff2', '', 5, true)
      }
    }
  }
  
  X = X4
  Y = Y4
  Z = 0
  R(Rl,Pt,Yw,1)
  if(Z>0){
    l = Q()
    s = Math.min(1e4, 1e3/Z)
    x.drawImage(starImgs[4].img,l[0]-s/2/1.06,l[1]-s/2/1.06,s,s)
    s *= 1.75
    x.drawImage(starImgs[0].img,l[0]-s/2,l[1]-s/2,s,s)
  }
  
  queue.map((v, i) => {
    prevLs = .5 / (.66+ i/40)
    X = -i * prevLs * 1.5 - 4
    Y = 9.1 - prevLs/2
    Z = 0
    R(Rl,Pt,Yw,1)
    if(Z>0){
      l = Q()
      s = Math.min(1e3, 700 / Z * prevLs)
      x.drawImage(spheres[v], l[0]-s/2, l[1]-s/2, s, s)
    }
  })

  curShot.vx /= drag2
  curShot.vy /= drag2
  curShot.vz /= drag2
  curShot.vx += (curShot.X_ - curShot.X) / homing2
  curShot.vy += (curShot.Y_ - curShot.Y) / homing2
  curShot.vz += (curShot.Z_ - curShot.Z) / homing2
  curShot.X_ += curShot.vx2
  curShot.Y_ += curShot.vy2
  curShot.Z_ += curShot.vz2
  X = curShot.X += curShot.vx
  Y = curShot.Y += curShot.vy
  Z = curShot.Z += curShot.vz
  R(Rl,Pt,Yw,1)
  if(Z>0){
    l = Q()
    s = Math.min(1e4, 700/Z*iBr)
    x.drawImage(spheres[curShot.idx],l[0]-s/2,l[1]-s/2,s,s)
  }
  if(curShot.fired){
    shotPlaced = false
    X1 = curShot.X_ + curShot.vx2/2
    Y1 = curShot.Y_ + curShot.vy2/2
    Z1 = curShot.Z_ + curShot.vz2/2
    B.map(v=>{
      X2 = v[0]
      Y2 = v[1]
      Z2 = v[2]
      if(!shotPlaced && (d = Math.hypot(X2-X1,Y2-Y1,Z2-Z1))<iBr*.9){
        curShot.vx =0
        curShot.vy =0
        curShot.vz =0
        curShot.vx2 =0
        curShot.vy2 =0
        curShot.vz2 =0
        placeCurShot()
        shotPlaced = true
      }
    })
    if(curShot.fired){
      if(X1-iBr/2<X1a || X1+iBr/2>X1b){
        curShot.vx2 *= -1
      }
    }
  }
  
  if(roundover){
    x.globalAlpha = .66
    x.drawImage(victory ? vicpic : death, 0, 0, c.width, c.height)
    x.globalAlpha = 1
    x.fillStyle = victory ? '#102b' : '#200b'
    x.fillRect(0,0,c.width,c.height)
    x.font = (fs = 150) + 'px Courier'
    x.lineWidth = 20
    if(victory){
      x.fillStyle = '#0f8'
      x.strokeStyle = '#1048'
      x.strokeText('👍', c.width/2, c.height/2 - fs/2 - fs + fs/30)
      x.fillText('👍', c.width/2, c.height/2 - fs/2 - fs + fs/30)
      x.strokeText('victory!', c.width/2, c.height/2 - fs/2 + fs/30)
      x.fillText('victory!', c.width/2, c.height/2 - fs/2 + fs/30)
    }else{
      x.fillStyle = '#f00'
      x.strokeStyle = '#0008'
      x.strokeText('☠️', c.width/2, c.height/2 - fs/2 - fs + fs/30)
      x.fillText('☠️', c.width/2, c.height/2 - fs/2 - fs + fs/30)
      x.strokeText('game over!', c.width/2, c.height/2 - fs/2 + fs/30)
      x.fillText('game over!', c.width/2, c.height/2 - fs/2 + fs/30)
    }
    x.strokeText('hit space', c.width/2, c.height/2 + fs + fs/30)
    x.fillText('hit space', c.width/2, c.height/2 + fs + fs/30)
    x.strokeText('to continue', c.width/2, c.height/2 + fs * 2 + fs/30)
    x.fillText('to continue', c.width/2, c.height/2 + fs * 2 + fs/30)
  }else{
    B.map((v, i) => {
      if(v[0]<-3.5 || v[0]>3.5){
        if(!v[10] && v[1] > ls + 5.5){
          console.log(2)
          roundover = true
          deathTimer = t + deathTimerInterval
        }
      }else{
        if(!v[10] && v[1] > ls + 3.5){
          console.log(3)
          roundover = true
          deathTimer = t + deathTimerInterval
        }
      }
    })
  }
  
  sparks = sparks.filter(v=>v[6] > 0)
  sparks.map(v => {
    X = v[0] += v[3]
    Y = v[1] += v[4]
    Z = v[2] += v[5]
    R(Rl,Pt,Yw,1)
    if(Z>0){
      l = Q()
      s = Math.min(1e4, 1e3/Z*v[6])
      x.fillStyle = `hsla(${360/8 * v[7]-40}, 99%, 50%, .04)`
      x.fillRect(l[0]-s/2,l[1]-s/2,s,s)
      s/=3
      x.fillStyle = `hsla(${360/8*v[7]}, 99%, 50%, .1)`
      x.fillRect(l[0]-s/2,l[1]-s/2,s,s)
      s/=2.5
      x.fillStyle = '#ffffffff'
      x.fillRect(l[0]-s/2,l[1]-s/2,s,s)
    }
    v[6]-= .0125
  })
  
  B = B.filter(v=> Math.hypot(v[0], v[1], v[2]) < 20)
  if(Math.hypot(curShot.X_,curShot.Y_,curShot.Z_) > 20){
    loadShot()
  }
  
  if(!B.length) {
    roundover = true
    victory = true
  }

  x.textAlign = 'left'
  x.font = (fs = 40) + 'px Courier'
  x.fillStyle = '#fff'
  x.strokeStyle = '#000'
  x.lineWidth = 10
  x.strokeText(`score      ${score}` ,c.width*.6, c.height - fs/3-fs)
  x.fillText(`score      ${score}` ,c.width*.6, c.height - fs/3-fs)
  x.strokeText(`high-score ${highScore}` ,c.width*.6, c.height - fs/3)
  x.fillText(`high-score ${highScore}` ,c.width*.6, c.height - fs/3)
  x.textAlign = 'center'

  x.globalAlpha = .5
  x.drawImage(bg, 0, 0, c.width, c.height)
  x.globalAlpha = 1

  t+=1/60
  requestAnimationFrame(Draw)
}
Draw()