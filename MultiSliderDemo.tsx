"use client"

import React, { useRef, useState } from 'react';

const MultiSliderDemo = () => {

    //refs to track left style props of thumbs along slider track
    const sliderTrackRef = useRef<HTMLDivElement>(null);
    const sliderTrackThumbOneRef = useRef<HTMLDivElement>(null);
    const sliderTrackThumbTwoRef = useRef<HTMLDivElement>(null);
    const sliderTrackThumbThreeRef = useRef<HTMLDivElement>(null);

    //boolean to see if a thumb is being dragged and should have its left style prop updated
    const isDragging = useRef(false);

    //ref to identify current thumb being dragged
    const draggedThumb = useRef('');

    //initial left %s of thumbs along track
    const [thumbPositionOne, setThumbPositionOne] = useState<number>(25);
    const [thumbPositionTwo, setThumbPositionTwo] = useState<number>(50);
    const [thumbPositionThree, setThumbPositionThree] = useState<number>(75);


    // updates the draggedThumbs position between either the edges of the slider tack or another thumb
    const updateThumbPosition = (event: MouseEvent | React.MouseEvent<HTMLDivElement>) => {
      const track = sliderTrackRef.current;
      if (track) {
        // get left most point of track in browser
        const trackRect = track.getBoundingClientRect();
        // get distance between click point and left side of track
        const clickX = event.clientX - trackRect.left;
        let leftLimit;
        let rightLimit;
        let newPosition;
        switch(draggedThumb.current){
          case 'thumb-1':
            leftLimit = 0;
            // get left style of adjacent second thumb
            rightLimit = parseFloat(sliderTrackThumbTwoRef.current?.style.left as string)/100
            //gets amount of left of new position from the left limit which is the left side of track
            newPosition = Math.min(Math.max(clickX / trackRect.width, leftLimit), rightLimit);
            setThumbPositionOne(newPosition * 100); // Update thumb position in percentage
            break;
          case 'thumb-2':
            leftLimit = parseFloat(sliderTrackThumbOneRef.current?.style.left as string)/100
            rightLimit = parseFloat(sliderTrackThumbThreeRef.current?.style.left as string)/100
            newPosition = Math.min(Math.max(clickX / trackRect.width, leftLimit), rightLimit);
            setThumbPositionTwo(newPosition * 100);
            break;
          case 'thumb-3':
            leftLimit = parseFloat(sliderTrackThumbTwoRef.current?.style.left as string)/100
            rightLimit = 1
            newPosition = Math.min(Math.max(clickX / trackRect.width, leftLimit), rightLimit);
            setThumbPositionThree(newPosition * 100);
            break;
          default:
            break;
        }
      }
    }

    const handleMouseMove = (event: MouseEvent) => {
      if(isDragging.current){
        updateThumbPosition(event);
      }
    };

    const handleMouseUp = () => {
    // Remove event listeners when the mouse is released
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    isDragging.current = false;
    };

    const handleThumbClick = (event) => {
    // attach handleMouseMove and handleMouseUp actions to thumb being dragged
      draggedThumb.current = event.target.attributes.id.value
      isDragging.current = true;
      updateThumbPosition(event);
      document.addEventListener('mousemove',handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

  return (
    <div className='relative w-full h-[48px]' >
        <div ref={sliderTrackRef} className="absolute top-1/2 left-0 w-full h-1 bg-gray-300 rounded transform -translate-y-1/2"></div>
        <div id='thumb-1' ref={sliderTrackThumbOneRef} style={{ left: `${thumbPositionOne}%`, zIndex : 100 }} onMouseDown={(e) => handleThumbClick(e)} className="absolute top-1/2 left-0 w-8 h-8 bg-white border border-gray-300 rounded-full transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"></div>
        <div id='thumb-2' ref={sliderTrackThumbTwoRef} style={{ left: `${thumbPositionTwo}%`, zIndex : 100 }} onMouseDown={handleThumbClick} className="absolute top-1/2 left-0 w-8 h-8 bg-white border border-gray-300 rounded-full transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"></div>
        <div id='thumb-3' ref={sliderTrackThumbThreeRef} style={{ left: `${thumbPositionThree}%`, zIndex : 100 }} onMouseDown={handleThumbClick} className="absolute top-1/2 left-0 w-8 h-8 bg-white border border-gray-300 rounded-full transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"></div>
    </div>
  )
}

export default MultiSliderDemo;
