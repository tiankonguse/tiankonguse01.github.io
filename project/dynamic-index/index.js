function throttle(e, n) {
    var t = null ;
    return function() {
        var o = this
          , i = arguments;
        clearTimeout(t),
        t = setTimeout(function() {
            e.apply(o, i)
        }
        , n)
    }
}
function onDocumentMouseMove(e) {
    mouseX = .25 * (e.clientX - windowHalfX),
    mouseY = .15 * (e.clientY - windowHalfY)
}
function animate() {
    requestAnimationFrame(animate),
    position = .03 * (Date.now() - start_time) % 8e3,
    camera.position.x += .01 * (mouseX - camera.position.x),
    camera.position.y += .01 * (-mouseY - camera.position.y),
    camera.position.z = -position + 8e3,
    window.notSupport || renderer.render(scene, camera)
}
function init() {
    camera = new THREE.PerspectiveCamera(30,window.innerWidth / window.innerHeight,1,3e3),
    camera.position.z = 6e3,
    scene = new THREE.Scene,
    geometry = new THREE.Geometry;
    var e = THREE.ImageUtils.loadTexture("cloud.png", null , animate);
    e.magFilter = THREE.LinearMipMapLinearFilter,
    e.minFilter = THREE.LinearMipMapLinearFilter;
    var n = new THREE.Fog(4555956,-100,3e3);
    material = new THREE.ShaderMaterial({
        uniforms: {
            map: {
                type: "t",
                value: e
            },
            fogColor: {
                type: "c",
                value: n.color
            },
            fogNear: {
                type: "f",
                value: n.near
            },
            fogFar: {
                type: "f",
                value: n.far
            }
        },
        vertexShader: document.getElementById("vs").textContent,
        fragmentShader: document.getElementById("fs").textContent,
        depthWrite: !1,
        depthTest: !1,
        transparent: !0
    });
    for (var t = new THREE.Mesh(new THREE.PlaneGeometry(64,64)), o = 0; 8e3 > o; o++)
        t.position.x = 1e3 * Math.random() - 500,
        t.position.y = -Math.random() * Math.random() * 200 - 15,
        t.position.z = o,
        t.rotation.z = Math.random() * Math.PI,
        t.scale.x = t.scale.y = Math.random() * Math.random() * 1.5 + .5,
        THREE.GeometryUtils.merge(geometry, t);
    mesh = new THREE.Mesh(geometry,material),
    scene.add(mesh),
    mesh = new THREE.Mesh(geometry,material),
    mesh.position.z = -8e3,
    scene.add(mesh),
    renderer = new THREE.WebGLRenderer({
        antialias: !1
    }),
    renderer.setSize(window.innerWidth, window.innerHeight),
    container.appendChild(renderer.domElement),
    document.addEventListener("mousemove", onDocumentMouseMove, !1),
    window.addEventListener("resize", throttle(function() {
        camera.aspect = window.innerWidth / window.innerHeight,
        camera.updateProjectionMatrix(),
        window.notSupport || renderer.setSize(window.innerWidth, window.innerHeight)
    }
    , 100), !1)
}
function initGenie() {
    var e = document.querySelector("#overly-genie")
      , n = Snap(e.querySelector("svg"))
      , t = n.select("path")
      , o = e.getAttribute("data-steps").split(";")
      , i = o.length
      , a = [].slice.call(e.querySelectorAll("li"))
      , l = 0;
    if (classie.has(e, "open")) {
        l = i - 1,
        classie.remove(e, "open"),
        classie.add(e, "close");
        var r = function() {
            classie.remove(e, "close")
        }
          , s = function(e) {
            return e--,
            0 > e ? !1 : void t.animate({
                path: o[e]
            }, 60, mina.linear, function() {
                0 === e && r(),
                s(e)
            }
            )
        }
        ;
        s(l),
        e.querySelector(".main-con").style.display = "none",
        e.querySelector(".overlay-close").style.display = "none",
        a.forEach(function(e) {
            e.style.display = "none"
        }
        )
    } else if (!classie.has(e, "close")) {
        l = 0,
        classie.add(e, "open");
        var s = function(e) {
            return e++,
            e > i - 1 ? !1 : void t.animate({
                path: o[e]
            }, 60, mina.linear, function() {
                s(e)
            }
            )
        }
        ;
        s(l),
        setTimeout(function() {
            e.querySelector(".main-con").style.display = "block",
            isAll && (e.querySelector(".overlay-close").style.display = "block"),
            a.forEach(function(e, n) {
                window.setTimeout(function() {
                    e.style.display = "block"
                }
                , 500 * (n + 1))
            }
            )
        }
        , 1e3)
    }
}
function initBoxes() {
    function e(e) {
        for (var n, t, o = e.length; 0 !== o; )
            t = Math.floor(Math.random() * o),
            o -= 1,
            n = e[o],
            e[o] = e[t],
            e[t] = n;
        return e
    }
    var n = document.querySelector("#overly-boxes")
      , t = [].slice.call(n.querySelectorAll("svg > path"))
      , o = t.length
      , i = 0;
    e(t),
    classie.has(n, "open") ? (classie.remove(n, "open"),
    classie.add(n, "close"),
    t.forEach(function(e, t) {
        setTimeout(function() {
            ++i,
            e.style.display = "none",
            i === o && classie.remove(n, "close")
        }
        , 30 * t)
    }
    ),
    n.querySelector(".main-con").style.display = "none",
    n.querySelector(".overlay-close").style.display = "none") : classie.has(n, "close") || (classie.add(n, "open"),
    t.forEach(function(e, n) {
        setTimeout(function() {
            e.style.display = "block"
        }
        , 30 * n)
    }
    ),
    setTimeout(function() {
        n.querySelector(".main-con").style.display = "block",
        isAll && (n.querySelector(".overlay-close").style.display = "block")
    }
    , 1e3))
}
function initDoors() {
    var e = document.querySelector("#overly-door")
      , n = [].slice.call(e.querySelectorAll("li"));
    classie.has(e, "open") ? (classie.remove(e, "open"),
    e.querySelector(".main-con").style.display = "none",
    e.querySelector(".overlay-close").style.display = "none",
    n.forEach(function(e) {
        e.innerHTML = ""
    }
    )) : (classie.add(e, "open"),
    window.setTimeout(function() {
        e.querySelector(".main-con").style.display = "block",
        isAll && (e.querySelector(".overlay-close").style.display = "block"),
        n.forEach(function(e) {
            var n = e.getAttribute("data-str").split("")
              , t = [];
            n.forEach(function(e) {
                t.push('<span class="fadeInLeftBig">' + e + "</span>")
            }
            ),
            e.innerHTML = t.join("")
        }
        );
        var t = [].slice.call(e.querySelectorAll("li>span"));
        t.forEach(function(e, n) {
            setTimeout(function() {
                e.style.display = "inline-block"
            }
            , 50 * n)
        }
        )
    }
    , 1e3))
}
function play() {
    if (isStop)
        return !1;
    index > 6 ? index %= 6 : 5 == index && (isAll = !0);
    var e = 0;
    switch (index) {
    case 1:
    case 2:
        initDoors();
        break;
    case 3:
    case 4:
        initGenie();
        break;
    case 5:
    case 6:
        initBoxes()
    }
    e = index % 2 === 1 ? 15e3 : 3e3,
    index++,
    setTimeout(function() {
        play()
    }
    , e)
}
function bindClick(e, n) {
    [].slice.call(document.querySelectorAll(e)).forEach(function(e, t) {
        e.addEventListener("click", function() {
            n.call(null , e, t)
        }
        )
    }
    )
}
var container = document.getElementById("container"), camera, scene, renderer, mesh, geometry, material, mouseX = 0, mouseY = 0, start_time = Date.now(), windowHalfX = window.innerWidth / 2, windowHalfY = window.innerHeight / 2, index = 1, isAll = !1, isStop = !1, classie = {
    has: function(e, n) {
        return e.classList.contains(n)
    },
    add: function(e, n) {
        e.classList.add(n)
    },
    remove: function(e, n) {
        e.classList.remove(n)
    }
};
init();
setTimeout(function() {
    play()
}
, 3e3);
bindClick(".overlay-close", function() {
    [].slice.call(document.querySelectorAll(".main-item")).forEach(function(e) {
        e.style.display = "none"
    }
    )
}
);



