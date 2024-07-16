<script>
	import { createEventDispatcher } from 'svelte'
    
    
    const colorToggled = 'green'
    const colorUntoggled = 'gray'

    const strokeInactive = 'black'
    const strokeHighlight = 'pink'
    const strokePressed = 'red'

    $: strokeColor = strokeInactive
    $: bgcolor = colorUntoggled
    $: toggled = false
    $: label = "Off"

    function doToggle() {
        toggled = ! toggled
        label = toggled ? 'On' : 'Off'
        bgcolor = toggled ? colorToggled : colorUntoggled
    }

    // These are used only to provide table data on positions
    let x ={clientX: '0', clientY: '0'}
    let b = {...x}
    let f = {...x}
    let fi = {...x}
    let fo = {...x}
    let md = {...x}
    let me = {...x}
    let ml = {...x}
    let mm = {...x}
    let mo = {...x}
    let mu = {...x}
    let mv = {...x}
    let pc = {...x}
    let pd = {...x}
    let pe = {...x}
    let pl = {...x}
    let pm = {...x}
    let po = {...x}
    let pu = {...x}
    let pv = {...x}

    console.clear()
    function efmt(e) {
        return `type: ${e.type}, clientX: ${e.clientX.toFixed(0)}, clientY: ${e.clientY.toFixed(0)}`
    }
    function fmt(val, dec=2) { return parseFloat(val).toFixed(dec) }

    /*
        Event firing sequence (* indicates bubbles=true)

        - pointer first enters element:
        pointerover*
        pointerenter
        mouseover*
        mouseenter

        - pointer/mouse is pressed and released over the element
        pointerdown*
        mousedown*
        focus
        focusin*
        pointerup*
        mouseup*

        - pointer/mouse is moved outside the element
        pointerout*
        pointerleave
        mouseout*
        mouseleave

        - pointer/mousse is pressed outside the element
        blur
        focusout*
    */

    // --------------------------
    // Focus events
    // --------------------------

    // 'blur' fires when element loses focus, before the 'focusout' event, but DOES NOT BUBBLE (opposite of 'focus')
    function blur(e) {
        b = e
        // console.log(e.type, e)
    }
    // 'focus' fires when element recieves focus, BEFORE the 'focusin' event, and DOES NOT BUBBLE (opposite of 'blur')
    function focus(e) {
        f = e
        // console.log(e.type, e)
    }
    // 'focusin' fires when element recieves focus, AFTER the 'focus' event, and BUBBLEs
    function focusin(e) {
        fi = e
        // console.log(e.type, e)
    }
    // 'focusout' fires when element loses focus, AFTER the 'blur' event, and BUBBLEs
    function focusout(e) {
        fo = e
        // console.log(e.type, e)
    }

    // --------------------------
    // Pointer device events
    // --------------------------

    // Click sequence

    // An element receives a click event when any of the following occurs:
    // - a pointing-device button (such as a mouse's primary button) is both pressed and released while the pointer is located inside the element.
    // - a touch gesture is performed on the element
    // - the Space key or Enter key is pressed while the element is focused
    // If the button is pressed on one element and the pointer is moved outside the element
    // before the button is released, the event is fired on the most specific ancestor element
    // that contained both elements.
    // 'click' fires after both the 'mousedown' and 'mouseup' events have fired, in that order.
    // The event is a device-independent event — meaning it can be activated by touch, keyboard,
    // mouse, and any other mechanism provided by assistive technology.
    function click(e) {
        c = e
        console.log('CLICKED', e.type, e)
    }

    // The 'mousedown' event is fired at an Element when a pointing device button is pressed
    // while the pointer is inside the element.
    // Note: This differs from the 'click' event in that 'click' is fired after a full click action occurs;
    // that is, the mouse button is pressed and released while the pointer remains inside the same element.
    // 'mousedown' is fired the moment the button is initially pressed.
	function mousedown(e) {
        md = e
        // console.log(e.type, e)
    }
	function mouseenter(e) {
        me = e
        // console.log(e.type, e)
    }

    // The mouseleave event is fired at an Element when the cursor of a pointing device (usually a mouse)
    // is moved out of it.
    // 'mouseleave' and 'mouseout' are similar but differ in that 'mouseleave' does not bubble and 'mouseout' does.
    // This means that 'mouseleave' is fired when the pointer has exited the element and all of its descendants,
    // whereas 'mouseout' is fired when the pointer leaves the element or leaves one of the element's descendants
    // (even if the pointer is still within the element).
	function mouseleave(e) {
        ml = e
        // console.log(e.type, e)
    }
	function mousemove(e) {
        mm = e
    }
    // The 'mouseout' event BUBBLES
	function mouseout(e) {
        mo = e
        // console.log(e.type, e)
    }
	function mouseover(e) {
        mv = e
        // console.log(e.type, e)
    }
	function mouseup(e) {
        mu = e
        // console.log(e.type, e)
    }

	// The 'pointercancel' event is fired when the browser determines that there are unlikely
    // to be any more pointer events, or if after the pointerdown event is fired,
    // the pointer is then used to manipulate the viewport by panning, zooming, or scrolling.
    function pointercancel(e) {
        pc = e
        // console.log(e.type, e)
    }

    // The 'pointerdown' event is fired when a pointer becomes active (before the 'mousedown')
    // For mouse, it is fired when the device transitions from no buttons pressed to at least one button pressed.
    // For touch, it is fired when physical contact is made with the digitizer.
    // For pen, it is fired when the stylus makes physical contact with the digitizer.
    // Note: For touchscreen browsers that allow direct manipulation, a pointerdown event triggers
    // *implicit pointer capture*, which causes the target to capture all subsequent pointer events
    // as if they were occurring over the capturing target.
    // Accordingly, 'pointerover', 'pointerenter', 'pointerleave', and 'pointerout' will not fire
    // as long as this capture is set.
    // The capture can be released manually by calling element.releasePointerCapture on the target element,
    // or it will be implicitly released after a 'pointerup' or 'pointercancel' event.
    function pointerdown(e) {
        strokeColor = strokePressed
        pd = e
        console.log(e.type, e)
    }
	function pointerenter(e) {
        strokeColor = strokeHighlight
        pe = e
        // console.log(e.type, e)
    }
	function pointerleave(e) {
        strokeColor = strokeInactive
        pl = e
        // console.log(e.type, e)
    }
	function pointermove(e) {
        pm = e
    }
	function pointerout(e) {
        strokeColor = strokeInactive
        po = e
        // console.log(e.type, e)
    }
	function pointerover(e) {
        strokeColor = strokeHighlight
        pv = e
        // console.log(e.type, e)
    }
    
    // The 'pointerup' event is fired when a pointer is no longer active.
    // Remember that it is possible to get a 'pointercancel' event instead.
	function pointerup(e) {
        strokeColor = strokeHighlight
        doToggle()
        pu = e
        console.log(e.type, e)
    }

    function input(e) {
        console.log(e.type, e.key)
    }

    function keydown(e) {
        console.log(e.type, e.key)
    }

    function keyup(e) {
        console.log(e.type, e.key)
    }
</script>

<div>
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" viewBox="0 0 200 100"
        id="sampleSvgButton"
        role="button"
        tabindex="0"
        on:blur={blur}
        on:click={click}
        on:focus={focus}
        on:focusin={focusin}
        on:focusout={focusout}
        on:input={input}
        on:keydown={keydown}
        on:keyup={keyup}
        on:mousedown={mousedown}
        on:mouseenter={mouseenter}
        on:mouseleave={mouseleave}
        on:mousemove={mousemove}
        on:mouseout={mouseout}
        on:mouseover={mouseover}
        on:mouseup={mouseup}
        on:pointercancel={pointercancel}
        on:pointerdown={pointerdown}
        on:pointerenter={pointerenter}
        on:pointerleave={pointerleave}
        on:pointermove={pointermove}
        on:pointerout={pointerout}
        on:pointerover={pointerover}
        on:pointerup={pointerup}>
        <rect x='0' y='0' width='200' height='100'
            fill={bgcolor} stroke={strokeColor} stroke-width="4"/>
        <text x="100" y="60" text-anchor="middle">{label}</text>
        <svg width="200" height="200" viewBox="0 0 200 200" id="star">
            <title>Five Pointed Star</title>
            <path fill="red" stroke="#000" d="m25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z"/>
        </svg>
    </svg>
    <table border='all'>
        <tr><td>pointerdown</td><td>{fmt(pd.clientX)}</td><td>{fmt(pd.clientY)}</td></tr>
        <tr><td>pointerenter</td><td>{fmt(pe.clientX)}</td><td>{fmt(pe.clientY)}</td></tr>
        <tr><td>pointerleave</td><td>{fmt(pl.clientX)}</td><td>{fmt(pl.clientY)}</td></tr>
        <tr><td>pointermove</td><td>{fmt(pm.clientX)}</td><td>{fmt(pm.clientY)}</td></tr>
        <tr><td>pointerout</td><td>{fmt(po.clientX)}</td><td>{fmt(po.clientY)}</td></tr>
        <tr><td>pointerover</td><td>{fmt(pv.clientX)}</td><td>{fmt(pv.clientY)}</td></tr>
        <tr><td>pointerup</td><td>{fmt(pu.clientX)}</td><td>{fmt(pu.clientY)}</td></tr>
    </table>
    <table border='all'>
        <tr><td>mousedown</td><td>{fmt(md.clientX)}</td><td>{fmt(md.clientY)}</td></tr>
        <tr><td>mouseenter</td><td>{fmt(me.clientX)}</td><td>{fmt(me.clientY)}</td></tr>
        <tr><td>mouseleave</td><td>{fmt(ml.clientX)}</td><td>{fmt(ml.clientY)}</td></tr>
        <tr><td>mousemove</td><td>{fmt(mm.clientX)}</td><td>{fmt(mm.clientY)}</td></tr>
        <tr><td>mouseout</td><td>{fmt(mo.clientX)}</td><td>{fmt(mo.clientY)}</td></tr>
        <tr><td>mouseover</td><td>{fmt(mv.clientX)}</td><td>{fmt(mv.clientY)}</td></tr>
        <tr><td>mouseup</td><td>{fmt(mu.clientX)}</td><td>{fmt(mu.clientY)}</td></tr>
    </table>
</div>
