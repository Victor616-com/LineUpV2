import React from "react";
import ProfileTag from "./ProfileTag";

//Media Imports
import starSVG from "../../assets/images/review-star.svg";
import starSVGyellow from "../../assets/images/review-star-yellow.svg";
import instagramLogo from "../../assets/images/instagram-logo.svg";
import xLogo from "../../assets/images/x-logo.svg";
import youtubeLogo from "../../assets/images/youtube-logo.svg";
import tiktokLogo from "../../assets/images/tiktok-logo.svg";
import facebookLogo from "../../assets/images/facebook-logo.svg";
import artist1 from "../../assets/images/hayley.png";
import artist2 from "../../assets/images/linkin-park.png";
import artist3 from "../../assets/images/sleep-token.png";
import videoPlaceholder1 from "../../assets/images/video-placeholder-1.png";
import videoPlaceholder2 from "../../assets/images/video-placeholder-2.png";
const ProfileAbout = ({ profile }) => {
  return (
    <div className="flex flex-col gap-m px-m">
      <div className="flex flex-col gap-s">
        <p className="text-m text-lightGray">About me</p>
        <p className="px-[10px] text-m color-black">
          {profile.about_me && profile.about_me.trim() !== "" ? (
            profile.about_me
          ) : (
            <span className="text-m text-gray-400">Empty</span>
          )}
        </p>
      </div>
      <div className="flex flex-col gap-s">
        <p className="text-m text-lightGray">What I am looking for</p>
        <div className="flex flex-row flex-wrap gap-xxs px-[10px]">
          {profile.looking_for && profile.looking_for.length > 0 ? (
            profile.looking_for.map((tag) => (
              <ProfileTag key={tag}>{tag}</ProfileTag>
            ))
          ) : (
            <span className="text-m text-gray-400">Empty</span>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-s">
        <p className="text-m text-lightGray">Genras</p>
        <div className="flex flex-row flex-wrap gap-xxs px-[10px]">
          {profile.genres && profile.genres.length > 0 ? (
            profile.genres.map((tag) => (
              <ProfileTag key={tag}>{tag}</ProfileTag>
            ))
          ) : (
            <span className="text-m text-gray-400">Empty</span>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-s">
        <p className="text-m text-lightGray">Reviews</p>
        <div className="flex flex-col px-xs gap-xs">
          <div className="flex flex-row flex-wrap gap-m">
            <div className="flex flex-row gap-xxs w-fit">
              <img src={starSVGyellow} alt="star" />
              <img src={starSVGyellow} alt="star" />
              <img src={starSVGyellow} alt="star" />
              <img src={starSVGyellow} alt="star" />
              <img src={starSVG} alt="star" />
            </div>
            <p className="text-s w-fit">35 reviews</p>
          </div>
          <p className="text-m mt-[5px]">
            “Finally, someone bringing real death metal spirit back. No trends,
            no compromises — just heavy, dark, and brutally honest music.” -
            Alex
          </p>
          <p className="text-m font-bold">See more</p>
        </div>
      </div>
      <div className="flex flex-col gap-s">
        <p className="text-m text-lightGray">Social Media</p>
        <div className="flex flex-row justify-between px-[10px]">
          <img src={instagramLogo} alt="instagram" />
          <img src={xLogo} alt="x" />
          <img src={youtubeLogo} alt="youtube" />
          <img src={tiktokLogo} alt="tiktok" />
          <img src={facebookLogo} alt="facebook" />
        </div>
      </div>
      <div className="flex flex-col gap-s">
        <p className="text-m text-lightGray">Artists I like</p>
        <div className="flex flex-row px-[10px] items-center">
          <img
            src={artist1}
            alt="artist1"
            className="w-[77px] h-[77px] rounded-full object-cover ring-3 ring-white"
          />
          <img
            src={artist2}
            alt="artist2"
            className="w-[77px] h-[77px] rounded-full object-cover ring-3 ring-white -ml-6"
          />
          <img
            src={artist3}
            alt="artist3"
            className="w-[77px] h-[77px] rounded-full object-cover ring-3 ring-white -ml-6"
          />
          <div className="w-[77px] h-[77px] flex justify-center items-center rounded-full bg-profileColor1 ring-3 ring-white -ml-6">
            <p className="text-m text-white text-2xl">+5</p>
          </div>
          <p className="text-m ml-[15px]"> See all</p>
        </div>
      </div>
      <div className="flex flex-col gap-s">
        <p className="text-m text-lightGray">Videos</p>
        <div className="flex flex-col gap-s px-[10px]">
          <img
            className="rounded-small w-fit h-auto"
            src={videoPlaceholder1}
            alt="video"
          />
          <img
            className="rounded-small w-fit h-auto"
            src={videoPlaceholder2}
            alt="video"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileAbout;
