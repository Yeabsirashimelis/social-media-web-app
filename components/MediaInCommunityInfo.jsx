import Image from "next/image";
import { getMedias } from "@/services/communityApi";
import { useQuery } from "@tanstack/react-query";
import Spinner from "./Spinner";
import Error from "../components/Error";
import { Gallery, Item } from "react-photoswipe-gallery";

function MediaInCommunityInfo({ inviteLink }) {
  const {
    data: medias,
    isLoading,
    error,
  } = useQuery({
    queryFn: () => getMedias(inviteLink),
    queryKey: ["mediasToCurrentCommunity", inviteLink],
  });

  console.log(medias);

  if (isLoading) return <Spinner />;
  if (error) return <Error />;

  return (
    <div className="grid grid-cols-3  gap-4 mt-2">
      <Gallery>
        {medias.map((media, idx) => {
          const isVideo = media.includes("video");
          return (
            <div className="relative" key={idx}>
              {isVideo ? (
                <video
                  src={media}
                  muted
                  controls
                  autoPlay
                  loop
                  className="rounded-lg w-full h-full object-cover"
                />
              ) : (
                <Item
                  original={media}
                  thumbnail={media}
                  width="800"
                  height="1000"
                >
                  {({ ref, open }) => (
                    <div className="relative">
                      {" "}
                      <Image
                        ref={ref}
                        onClick={open}
                        src={media}
                        alt="media"
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="rounded-lg w-full h-24 object-cover cursor-pointer "
                      />
                      {/* Dark Overlay on hover */}
                      <div
                        className="absolute inset-0 bg-black opacity-0
                    hover:opacity-30 transition-all duration-200"
                      ></div>
                    </div>
                  )}
                </Item>
              )}
            </div>
          );
        })}
      </Gallery>
    </div>
  );
}

export default MediaInCommunityInfo;
