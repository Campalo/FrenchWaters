import React, { Fragment } from 'react';

function Content() {
    return (
        <Fragment>
            <h1>
            Intersection observer concepts and usage
            </h1>
            <p>
                The Intersection Observer API provides a way to asynchronously observe changes in the intersection of a target element with an ancestor element or with a top-level document's viewport.
            </p>
            <p>
            Historically, detecting visibility of an element, or the relative visibility of two elements in relation to each other, has been a difficult task for which solutions have been unreliable and prone to causing the browser and the sites the user is accessing to become sluggish. As the web has matured, the need for this kind of information has grown. Intersection information is needed for many reasons, such as:
            </p>
            <p>
            Consider a web page that uses infinite scrolling. It uses a vendor-provided library to manage the advertisements placed periodically throughout the page, has animated graphics here and there, and uses a custom library that draws notification boxes and the like. Each of these has its own intersection detection routines, all running on the main thread. The author of the web site may not even realize this is happening, since they may know very little about the inner workings of the two libraries they are using. As the user scrolls the page, these intersection detection routines are firing constantly during the scroll handling code, resulting in an experience that leaves the user frustrated with the browser, the web site, and their computer.
            </p>
            <p>
            The Intersection Observer API lets code register a callback function that is executed whenever an element they wish to monitor enters or exits another element (or the viewport), or when the amount by which the two intersect changes by a requested amount. This way, sites no longer need to do anything on the main thread to watch for this kind of element intersection, and the browser is free to optimize the management of intersections as it sees fit.
            </p>
            <p>
            One thing the Intersection Observer API can't tell you: the exact number of pixels that overlap or specifically which ones they are; however, it covers the much more common use case of "If they intersect by somewhere around N%, I need to do something."
            </p>
            <p>
            The Intersection Observer API allows you to configure a callback that is called:
            (1) whenever one element, called the target, intersects either the device viewport or a specified element; for the purpose of this API, this is called the root element or root
            (2) and whenever the observer is asked to watch a target for the very first time
            Typically, you'll want to watch for intersection changes with regard to the element's closest scrollable ancestor, or, if the element isn't a descendant of a scrollable element, the viewport. To watch for intersection relative to the root element, specify null.
            Whether you're using the viewport or some other element as the root, the API works the same way, executing a callback function you provide whenever the visibility of the target element changes so that it crosses desired amounts of intersection with the root.
            The degree of intersection between the target element and its root is the intersection ratio. This is a representation of the percentage of the target element which is visible as a value between 0.0 and 1.0.
            </p>
        </Fragment>
    )
}

export default Content;