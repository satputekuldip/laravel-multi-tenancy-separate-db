<?php

namespace App\Console\Commands;

use App\Models\Language;
use App\Models\Translation;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class TranslationsDownload extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'translations:download {--path=resources/js/locales}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Download translations from database to JSON files for frontend i18n';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $path = $this->option('path');
        $fullPath = base_path($path);

        if (! File::exists($fullPath)) {
            File::makeDirectory($fullPath, 0755, true);
        }

        $languages = Language::where('is_active', true)->get();

        foreach ($languages as $language) {
            $translations = Translation::where('language_id', $language->id)
                ->get()
                ->groupBy('group')
                ->map(function ($group) {
                    return $group->pluck('value', 'key')->toArray();
                })
                ->toArray();

            $filePath = $fullPath.'/'.$language->code.'.json';

            File::put($filePath, json_encode($translations, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

            $this->info("Downloaded translations for {$language->name} ({$language->code}) to {$filePath}");
        }

        $this->info('All translations downloaded successfully!');

        return Command::SUCCESS;
    }
}
