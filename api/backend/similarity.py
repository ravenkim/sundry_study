from difflib import SequenceMatcher

class TextSimilarity:
    def get_sim_ratio(objectTags, statusTags, nng_list, vv_list):
        combined_image_info = ''.join(sorted(objectTags) + sorted(statusTags))
        combined_text_info = ''.join(sorted(nng_list) + sorted(vv_list))

        matcher = SequenceMatcher(None, combined_image_info, combined_text_info)
        sim_ratio = matcher.ratio()

        return sim_ratio
